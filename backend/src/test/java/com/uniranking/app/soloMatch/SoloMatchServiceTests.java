package com.uniranking.app.soloMatch;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Collections;

import com.uniranking.app.domains.soloMatch.SoloMatchReport;
import com.uniranking.app.domains.soloMatch.SoloMatchServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.uniranking.app.domains.searching.exceptions.UniversityNotFoundException;
import com.uniranking.app.domains.searching.university.*;

@ExtendWith(MockitoExtension.class)
class SoloMatchServiceTests {

    @Mock
    private UniversityRepository universityRepository;

    @Mock
    private UniversityMapper universityMapper;

    @Mock
    private UniversityService universityService;

    @InjectMocks
    private SoloMatchServiceImpl soloMatchService;

    private University winner;
    private University loser;
    private UniversityResponse winnerResponse;
    private UniversityResponse loserResponse;

    @BeforeEach
    void setUp() {
        // Setup Winner
        winner = new University();
        winner.setId(1L);
        winner.setElo(1500);

        // Setup Loser
        loser = new University();
        loser.setId(2L);
        loser.setElo(1500);

        // Setup Responses (Assuming standard empty constructors exist via Lombok/Java)
        winnerResponse = new UniversityResponse();
        loserResponse = new UniversityResponse();
    }

    @Test
    void chooseWinner_ShouldUpdateEloAndCache_WhenBothUniversitiesExist() {
        // Arrange
        Long winnerId = 1L;
        Long loserId = 2L;

        when(universityRepository.findForEloUpdate(List.of(winnerId, loserId)))
                .thenReturn(List.of(winner, loser));

        when(universityMapper.toUniversityResponse(winner)).thenReturn(winnerResponse);
        when(universityMapper.toUniversityResponse(loser)).thenReturn(loserResponse);

        // Act
        SoloMatchReport report = soloMatchService.chooseWinner(winnerId, loserId);

        // Assert
        assertNotNull(report);
        assertEquals(winnerResponse, report.getWinner());
        assertEquals(loserResponse, report.getLoser());

        // Verify Elo updates were called with the correct IDs and some calculated integer
        verify(universityRepository).updateElo(eq(winnerId), anyInt());
        verify(universityRepository).updateElo(eq(loserId), anyInt());

        // Verify that the responses were cached
        verify(universityService).cacheUniversity(winnerResponse);
        verify(universityService).cacheUniversity(loserResponse);
    }

    @Test
    void chooseWinner_ShouldThrowException_WhenOneUniversityIsMissing() {
        // Arrange
        Long winnerId = 1L;
        Long loserId = 2L;

        // Only returning the winner, simulating the loser not being found in the DB
        when(universityRepository.findForEloUpdate(List.of(winnerId, loserId)))
                .thenReturn(List.of(winner));

        // Act & Assert
        UniversityNotFoundException exception = assertThrows(
                UniversityNotFoundException.class,
                () -> soloMatchService.chooseWinner(winnerId, loserId)
        );

        assertEquals("University not found for Elo calculation", exception.getMessage());

        // Verify that no database updates or caching occurred
        verify(universityRepository, never()).updateElo(anyLong(), anyInt());
        verify(universityMapper, never()).toUniversityResponse(any());
        verify(universityService, never()).cacheUniversity(any());
    }

    @Test
    void chooseWinner_ShouldThrowException_WhenBothUniversitiesAreMissing() {
        // Arrange
        Long winnerId = 1L;
        Long loserId = 2L;

        // Simulating neither university being found
        when(universityRepository.findForEloUpdate(List.of(winnerId, loserId)))
                .thenReturn(Collections.emptyList());

        // Act & Assert
        assertThrows(
                UniversityNotFoundException.class,
                () -> soloMatchService.chooseWinner(winnerId, loserId)
        );

        // Verify side effects are skipped
        verify(universityRepository, never()).updateElo(anyLong(), anyInt());
        verify(universityService, never()).cacheUniversity(any());
    }
}