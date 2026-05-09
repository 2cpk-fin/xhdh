package com.uniranking.app.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.exceptions.*;
import com.uniranking.app.domains.scheduleMatch.match.*;
import com.uniranking.app.domains.searching.university.University;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ScheduleMatchServiceTests {

    @Mock
    private ScheduleMatchRepository scheduleMatchRepository;
    @Mock
    private UniversityRepository universityRepository;
    @Mock
    private ScheduleMatchMapper scheduleMatchMapper;
    @Mock
    private ScheduleMatchRedisPort scheduleMatchRedisPort;

    // Notice: @Mock is completely removed here!
    private Authentication authentication;

    @InjectMocks
    private ScheduleMatchServiceImpl scheduleMatchServiceImpl;

    private ScheduleMatch scheduleMatch;
    private ScheduleMatchRequest matchRequest;
    private ScheduleMatchResponse matchResponse;
    private String publicMatchIdStr;

    @BeforeEach
    void setUp() {
        UUID publicMatchId = UUID.randomUUID();
        publicMatchIdStr = publicMatchId.toString();

        scheduleMatch = new ScheduleMatch();
        scheduleMatch.setId(1L);
        scheduleMatch.setPublicMatchId(publicMatchId);
        scheduleMatch.setStatus(Status.NOT_STARTED);

        matchRequest = new ScheduleMatchRequest();
        matchRequest.setTitle("Test Match");
        matchRequest.setUniIds(List.of(1L, 2L));
        matchRequest.setStartTime(LocalDateTime.now().plusHours(1));
        matchRequest.setEndTime(LocalDateTime.now().plusDays(2));

        matchResponse = new ScheduleMatchResponse();
        matchResponse.setId(1L);
        matchResponse.setPublicMatchId(publicMatchId);

        authentication = new UsernamePasswordAuthenticationToken("user1", null);
    }

    @Test
    void vote_Success_NewVote() {
        when(scheduleMatchRedisPort.getMatchStatus(publicMatchIdStr)).thenReturn(Status.PENDING.name());
        when(scheduleMatchRedisPort.getUserVote(publicMatchIdStr, "user1")).thenReturn(null);

        scheduleMatchServiceImpl.vote(1L, publicMatchIdStr, authentication);

        verify(scheduleMatchRedisPort).recordNewVote(publicMatchIdStr, "user1", 1L);
        verify(scheduleMatchRedisPort, never()).changeVote(anyString(), anyString(), anyLong(), anyLong());
    }

    @Test
    void vote_Success_ChangeVote() {
        when(scheduleMatchRedisPort.getMatchStatus(publicMatchIdStr)).thenReturn(Status.PENDING.name());
        when(scheduleMatchRedisPort.getUserVote(publicMatchIdStr, "user1")).thenReturn(2L);

        scheduleMatchServiceImpl.vote(1L, publicMatchIdStr, authentication);

        verify(scheduleMatchRedisPort).changeVote(publicMatchIdStr, "user1", 2L, 1L);
        verify(scheduleMatchRedisPort, never()).recordNewVote(anyString(), anyString(), anyLong());
    }

    @Test
    void vote_ThrowsDuplicateVoteException() {
        when(scheduleMatchRedisPort.getMatchStatus(publicMatchIdStr)).thenReturn(Status.PENDING.name());
        when(scheduleMatchRedisPort.getUserVote(publicMatchIdStr, "user1")).thenReturn(1L);

        assertThrows(DuplicateVoteException.class, () ->
                scheduleMatchServiceImpl.vote(1L, publicMatchIdStr, authentication));
    }

    @Test
    void vote_ThrowsMatchNotStartedException() {
        when(scheduleMatchRedisPort.getMatchStatus(publicMatchIdStr)).thenReturn(Status.NOT_STARTED.name());

        assertThrows(MatchNotStartedException.class, () ->
                scheduleMatchServiceImpl.vote(1L, publicMatchIdStr, authentication));
    }

    @Test
    void vote_ThrowsMatchNotFoundException() {
        when(scheduleMatchRedisPort.getMatchStatus(publicMatchIdStr)).thenReturn(null);

        assertThrows(MatchNotFoundException.class, () ->
                scheduleMatchServiceImpl.vote(1L, publicMatchIdStr, authentication));
    }

    @Test
    void getAllMatches_ReturnsPage() {
        Page<ScheduleMatch> page = new PageImpl<>(List.of(scheduleMatch));
        when(scheduleMatchRepository.findAll(any(PageRequest.class))).thenReturn(page);
        when(scheduleMatchMapper.toScheduleMatchResponse(scheduleMatch)).thenReturn(matchResponse);

        Page<ScheduleMatchResponse> result = scheduleMatchServiceImpl.getAllMatches(0, 10);

        assertEquals(1, result.getContent().size());
    }

    @Test
    void getAllNotStartedMatches_ReturnsList() {
        when(scheduleMatchRepository.findAllNotStartedMatch()).thenReturn(List.of(scheduleMatch));
        when(scheduleMatchMapper.toScheduleMatchResponse(scheduleMatch)).thenReturn(matchResponse);

        List<ScheduleMatchResponse> result = scheduleMatchServiceImpl.getAllNotStartedMatches();

        assertEquals(1, result.size());
    }

    @Test
    void createMatch_Success() {
        when(scheduleMatchMapper.toScheduleMatch(matchRequest)).thenReturn(scheduleMatch);
        when(universityRepository.findById(1L)).thenReturn(Optional.of(new University()));
        when(universityRepository.findById(2L)).thenReturn(Optional.of(new University()));
        when(scheduleMatchRepository.save(any(ScheduleMatch.class))).thenReturn(scheduleMatch);
        when(scheduleMatchMapper.toScheduleMatchResponse(any(ScheduleMatch.class))).thenReturn(matchResponse);

        ScheduleMatchResponse result = scheduleMatchServiceImpl.createMatch(matchRequest);

        assertNotNull(result);
        verify(scheduleMatchRepository).save(any(ScheduleMatch.class));
        verify(scheduleMatchRedisPort).initializeMatch(eq(publicMatchIdStr), eq(matchRequest.getStartTime()), eq(matchRequest.getUniIds()));
    }

    @Test
    void createMatch_ThrowsInvalidMatchTimeException_PastStartTime() {
        matchRequest.setStartTime(LocalDateTime.now().minusDays(1));

        assertThrows(InvalidMatchTimeException.class, () -> scheduleMatchServiceImpl.createMatch(matchRequest));
    }

    @Test
    void createMatch_ThrowsInvalidParticipantCountException() {
        matchRequest.setUniIds(List.of(1L));
        when(scheduleMatchMapper.toScheduleMatch(matchRequest)).thenReturn(scheduleMatch);
        when(universityRepository.findById(1L)).thenReturn(Optional.of(new University()));

        assertThrows(InvalidParticipantCountException.class, () -> scheduleMatchServiceImpl.createMatch(matchRequest));
    }

    @Test
    void updateMatchById_Success() {
        when(scheduleMatchRepository.findById(1L)).thenReturn(Optional.of(scheduleMatch));
        when(scheduleMatchRepository.save(scheduleMatch)).thenReturn(scheduleMatch);
        when(scheduleMatchMapper.toScheduleMatchResponse(scheduleMatch)).thenReturn(matchResponse);

        ScheduleMatchResponse result = scheduleMatchServiceImpl.updateMatchById(1L, matchRequest);

        assertNotNull(result);
        verify(scheduleMatchMapper).updateMatchFromRequest(matchRequest, scheduleMatch);
    }

    @Test
    void deleteMatchById_Success() {
        when(scheduleMatchRepository.findById(1L)).thenReturn(Optional.of(scheduleMatch));

        String result = scheduleMatchServiceImpl.deleteMatchById(1L);

        assertEquals("The match with id 1 has been deleted", result);
        verify(scheduleMatchRepository).delete(scheduleMatch);
    }
}