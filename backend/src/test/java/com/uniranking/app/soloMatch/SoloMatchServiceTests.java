package com.uniranking.app.soloMatch;

import com.uniranking.app.domains.searching.exceptions.UniversityNotFoundException;
import com.uniranking.app.domains.searching.university.University;
import com.uniranking.app.domains.searching.university.UniversityMapper;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import com.uniranking.app.domains.searching.university.UniversityResponse;
import com.uniranking.app.domains.soloMatch.*;
import com.uniranking.app.domains.soloMatch.exceptions.InsufficientOpponentsException;
import com.uniranking.app.domains.soloMatch.exceptions.InvalidMatchParticipantException;
import com.uniranking.app.domains.soloMatch.exceptions.SoloMatchExpiredException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class SoloMatchServiceTests {

    @Mock
    private UniversityRepository universityRepository;
    @Mock
    private UniversityMapper universityMapper;
    @Mock
    private SoloMatchRedisPort soloMatchRedisPort;

    @InjectMocks
    private SoloMatchServiceImpl soloMatchServiceImpl;

    private University uni1, uni2, uni3, uni4;
    private UniversityResponse uniResponse1, uniResponse2;

    @BeforeEach
    public void setUp() {
        uni1 = University.builder().id(1L).name("University of Engineering").abbreviation("UET").elo(1000).build();
        uni2 = University.builder().id(2L).name("Hanoi University of Science").abbreviation("HUST").elo(1100).build();
        uni3 = University.builder().id(3L).name("Hanoi Medical University").abbreviation("HMU").elo(900).build();
        uni4 = University.builder().id(4L).name("FPT University").abbreviation("FPT").elo(1200).build();

        uniResponse1 = new UniversityResponse();
        uniResponse1.setName("University of Engineering");
        uniResponse2 = new UniversityResponse();
        uniResponse2.setName("Hanoi University of Science");
    }

    @Test
    public void SoloMatchService_StartNewDuel_ReturnSoloMatchResponse() {
        when(universityRepository.findRandom()).thenReturn(uni1);
        when(universityRepository.findAllOpponentsWithSharedTag(uni1.getId())).thenReturn(List.of(uni2));
        when(universityMapper.toUniversityResponse(uni1)).thenReturn(uniResponse1);
        when(universityMapper.toUniversityResponse(uni2)).thenReturn(uniResponse2);

        SoloMatchResponse result = soloMatchServiceImpl.startNewDuel();

        assertThat(result).isNotNull();
        assertThat(result.getPublicMatchId()).isNotNull();
        assertThat(result.getUniversity1()).isEqualTo(uniResponse1);
        assertThat(result.getUniversity2()).isEqualTo(uniResponse2);
    }

    @Test
    public void SoloMatchService_StartNewDuel_SavesMatchToPortWithThreeMinuteTtl() {
        when(universityRepository.findRandom()).thenReturn(uni1);
        when(universityRepository.findAllOpponentsWithSharedTag(uni1.getId())).thenReturn(List.of(uni2));
        when(universityMapper.toUniversityResponse(any())).thenReturn(uniResponse1);

        soloMatchServiceImpl.startNewDuel();

        verify(soloMatchRedisPort).saveMatch(any(SoloMatch.class), eq(3L));
    }

    @Test
    public void SoloMatchService_StartNewDuel_StoredSoloMatchHasCorrectUniversityIds() {
        when(universityRepository.findRandom()).thenReturn(uni1);
        when(universityRepository.findAllOpponentsWithSharedTag(uni1.getId())).thenReturn(List.of(uni2));
        when(universityMapper.toUniversityResponse(any())).thenReturn(uniResponse1);

        soloMatchServiceImpl.startNewDuel();

        ArgumentCaptor<SoloMatch> matchCaptor = ArgumentCaptor.forClass(SoloMatch.class);
        verify(soloMatchRedisPort).saveMatch(matchCaptor.capture(), anyLong());

        SoloMatch stored = matchCaptor.getValue();
        assertThat(stored.getUni1Id()).isEqualTo(uni1.getId());
        assertThat(stored.getUni2Id()).isEqualTo(uni2.getId());
        assertThat(stored.getPublicMatchId()).isNotNull();
    }

    @Test
    public void SoloMatchService_StartNewDuel_NoCandidates_ThrowsInsufficientOpponentsException() {
        when(universityRepository.findRandom()).thenReturn(uni3);
        doReturn(Collections.emptyList()).when(universityRepository).findAllOpponentsWithSharedTag(uni3.getId());

        assertThatThrownBy(() -> soloMatchServiceImpl.startNewDuel())
                .isInstanceOf(InsufficientOpponentsException.class)
                .hasMessageContaining("shared tags");

        verifyNoInteractions(soloMatchRedisPort);
    }

    @Test
    public void SoloMatchService_StartNewDuel_MultipleCandidates_OpponentIsOneOfThem() {
        when(universityRepository.findRandom()).thenReturn(uni1);
        when(universityRepository.findAllOpponentsWithSharedTag(uni1.getId()))
                .thenReturn(List.of(uni2, uni4));
        when(universityMapper.toUniversityResponse(any())).thenReturn(uniResponse1);

        soloMatchServiceImpl.startNewDuel();

        ArgumentCaptor<SoloMatch> matchCaptor = ArgumentCaptor.forClass(SoloMatch.class);
        verify(soloMatchRedisPort).saveMatch(matchCaptor.capture(), anyLong());
        assertThat(matchCaptor.getValue().getUni2Id()).isIn(uni2.getId(), uni4.getId());
    }

    @RepeatedTest(10)
    public void SoloMatchService_StartNewDuel_OpponentIsNeverSameAsUni1() {
        when(universityRepository.findRandom()).thenReturn(uni1);
        when(universityRepository.findAllOpponentsWithSharedTag(uni1.getId()))
                .thenReturn(List.of(uni2, uni4));
        when(universityMapper.toUniversityResponse(any())).thenReturn(uniResponse1);

        soloMatchServiceImpl.startNewDuel();

        ArgumentCaptor<SoloMatch> matchCaptor = ArgumentCaptor.forClass(SoloMatch.class);
        verify(soloMatchRedisPort).saveMatch(matchCaptor.capture(), anyLong());
        assertThat(matchCaptor.getValue().getUni2Id()).isNotEqualTo(uni1.getId());

        clearInvocations(soloMatchRedisPort);
    }

    @Test
    public void SoloMatchService_ChooseWinner_Uni1Wins_ReturnCorrectReport() {
        UUID matchId = UUID.randomUUID();
        SoloMatch stored = buildMatch(matchId, uni1, uni2);

        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(stored);
        when(universityRepository.findById(uni1.getId())).thenReturn(Optional.of(uni1));
        when(universityRepository.findById(uni2.getId())).thenReturn(Optional.of(uni2));
        when(universityMapper.toUniversityResponse(uni1)).thenReturn(uniResponse1);
        when(universityMapper.toUniversityResponse(uni2)).thenReturn(uniResponse2);

        SoloMatchReport report = soloMatchServiceImpl.chooseWinner(matchId, uni1.getId());

        assertThat(report).isNotNull();
        assertThat(report.getWinner()).isEqualTo(uniResponse1);
        assertThat(report.getLoser()).isEqualTo(uniResponse2);
    }

    @Test
    public void SoloMatchService_ChooseWinner_Uni2Wins_WinnerAndLoserAreSwapped() {
        UUID matchId = UUID.randomUUID();
        SoloMatch stored = buildMatch(matchId, uni1, uni2);

        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(stored);
        when(universityRepository.findById(uni2.getId())).thenReturn(Optional.of(uni2));
        when(universityRepository.findById(uni1.getId())).thenReturn(Optional.of(uni1));
        when(universityMapper.toUniversityResponse(uni2)).thenReturn(uniResponse2);
        when(universityMapper.toUniversityResponse(uni1)).thenReturn(uniResponse1);

        SoloMatchReport report = soloMatchServiceImpl.chooseWinner(matchId, uni2.getId());

        assertThat(report.getWinner()).isEqualTo(uniResponse2);
        assertThat(report.getLoser()).isEqualTo(uniResponse1);
    }

    @Test
    public void SoloMatchService_ChooseWinner_WinnerEloIncreases() {
        int originalElo = uni1.getElo();
        UUID matchId = UUID.randomUUID();
        SoloMatch stored = buildMatch(matchId, uni1, uni2);

        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(stored);
        when(universityRepository.findById(uni1.getId())).thenReturn(Optional.of(uni1));
        when(universityRepository.findById(uni2.getId())).thenReturn(Optional.of(uni2));
        when(universityMapper.toUniversityResponse(any())).thenReturn(new UniversityResponse());

        SoloMatchReport report = soloMatchServiceImpl.chooseWinner(matchId, uni1.getId());

        assertThat(report.getWinnerEloChange()).isPositive();
        assertThat(uni1.getElo()).isGreaterThan(originalElo);
    }

    @Test
    public void SoloMatchService_ChooseWinner_LoserEloDecreases() {
        int originalElo = uni2.getElo();
        UUID matchId = UUID.randomUUID();
        SoloMatch stored = buildMatch(matchId, uni1, uni2);

        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(stored);
        when(universityRepository.findById(uni1.getId())).thenReturn(Optional.of(uni1));
        when(universityRepository.findById(uni2.getId())).thenReturn(Optional.of(uni2));
        when(universityMapper.toUniversityResponse(any())).thenReturn(new UniversityResponse());

        SoloMatchReport report = soloMatchServiceImpl.chooseWinner(matchId, uni1.getId());

        assertThat(report.getLoserEloChange()).isPositive();
        assertThat(uni2.getElo()).isLessThan(originalElo);
    }

    @Test
    public void SoloMatchService_ChooseWinner_EqualStartingElo_ChangesAreSymmetric() {
        uni1 = University.builder().id(1L).abbreviation("UET").elo(1200).build();
        uni2 = University.builder().id(2L).abbreviation("HUST").elo(1200).build();
        UUID matchId = UUID.randomUUID();
        SoloMatch stored = buildMatch(matchId, uni1, uni2);

        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(stored);
        when(universityRepository.findById(uni1.getId())).thenReturn(Optional.of(uni1));
        when(universityRepository.findById(uni2.getId())).thenReturn(Optional.of(uni2));
        when(universityMapper.toUniversityResponse(any())).thenReturn(new UniversityResponse());

        SoloMatchReport report = soloMatchServiceImpl.chooseWinner(matchId, uni1.getId());

        assertThat(report.getWinnerEloChange()).isEqualTo(report.getLoserEloChange());
    }

    @Test
    public void SoloMatchService_ChooseWinner_BothUniversitiesSavedAfterEloUpdate() {
        UUID matchId = UUID.randomUUID();
        SoloMatch stored = buildMatch(matchId, uni1, uni2);

        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(stored);
        when(universityRepository.findById(uni1.getId())).thenReturn(Optional.of(uni1));
        when(universityRepository.findById(uni2.getId())).thenReturn(Optional.of(uni2));
        when(universityMapper.toUniversityResponse(any())).thenReturn(new UniversityResponse());

        soloMatchServiceImpl.chooseWinner(matchId, uni1.getId());

        verify(universityRepository).save(uni1);
        verify(universityRepository).save(uni2);
    }

    @Test
    public void SoloMatchService_ChooseWinner_MatchDeletedFromRedisAfterResolution() {
        UUID matchId = UUID.randomUUID();
        SoloMatch stored = buildMatch(matchId, uni1, uni2);

        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(stored);
        when(universityRepository.findById(uni1.getId())).thenReturn(Optional.of(uni1));
        when(universityRepository.findById(uni2.getId())).thenReturn(Optional.of(uni2));
        when(universityMapper.toUniversityResponse(any())).thenReturn(new UniversityResponse());

        soloMatchServiceImpl.chooseWinner(matchId, uni1.getId());

        verify(soloMatchRedisPort).deleteMatch(matchId);
    }

    @Test
    public void SoloMatchService_ChooseWinner_ExpiredMatch_ThrowsSoloMatchExpiredException() {
        UUID matchId = UUID.randomUUID();
        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(null);

        assertThatThrownBy(() -> soloMatchServiceImpl.chooseWinner(matchId, uni1.getId()))
                .isInstanceOf(SoloMatchExpiredException.class)
                .hasMessageContaining("expired");

        verify(universityRepository, never()).findById(anyLong());
        verify(universityRepository, never()).save(any());
    }

    @Test
    public void SoloMatchService_ChooseWinner_WinnerNotInMatch_ThrowsInvalidMatchParticipantException() {
        UUID matchId = UUID.randomUUID();
        SoloMatch stored = buildMatch(matchId, uni1, uni2);
        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(stored);

        assertThatThrownBy(() -> soloMatchServiceImpl.chooseWinner(matchId, uni3.getId()))
                .isInstanceOf(InvalidMatchParticipantException.class)
                .hasMessageContaining("participant");

        verify(universityRepository, never()).findById(anyLong());
        verify(universityRepository, never()).save(any());
    }

    @Test
    public void SoloMatchService_ChooseWinner_WinnerMissingFromDb_ThrowsUniversityNotFoundException() {
        UUID matchId = UUID.randomUUID();
        SoloMatch stored = buildMatch(matchId, uni1, uni2);

        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(stored);
        when(universityRepository.findById(uni1.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> soloMatchServiceImpl.chooseWinner(matchId, uni1.getId()))
                .isInstanceOf(UniversityNotFoundException.class)
                .hasMessageContaining("Winning university");
    }

    @Test
    public void SoloMatchService_ChooseWinner_LoserMissingFromDb_ThrowsUniversityNotFoundException() {
        UUID matchId = UUID.randomUUID();
        SoloMatch stored = buildMatch(matchId, uni1, uni2);

        when(soloMatchRedisPort.getMatch(matchId)).thenReturn(stored);
        when(universityRepository.findById(uni1.getId())).thenReturn(Optional.of(uni1));
        when(universityRepository.findById(uni2.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> soloMatchServiceImpl.chooseWinner(matchId, uni1.getId()))
                .isInstanceOf(UniversityNotFoundException.class)
                .hasMessageContaining("Losing university");
    }

    private SoloMatch buildMatch(UUID matchId, University u1, University u2) {
        return new SoloMatch(matchId, u1.getId(), u2.getId(),
                u1.getPublicUniversityId(), u2.getPublicUniversityId());
    }
}