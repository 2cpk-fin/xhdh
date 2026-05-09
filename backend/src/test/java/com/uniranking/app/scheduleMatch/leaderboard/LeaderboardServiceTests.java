package com.uniranking.app.scheduleMatch.leaderboard;

import com.uniranking.app.domains.scheduleMatch.leaderboard.ScheduleMatchLeaderboardServiceImpl;
import com.uniranking.app.domains.scheduleMatch.leaderboard.LeaderboardRedisPort;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import com.uniranking.app.domains.searching.university.UniversityResponse;
import com.uniranking.app.domains.searching.university.UniversityService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.ZSetOperations;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaderboardServiceTests {

    @Mock
    private UniversityService universityServiceImpl;

    @Mock
    private LeaderboardRedisPort leaderboardRedisPort;

    @InjectMocks
    private ScheduleMatchLeaderboardServiceImpl leaderboardService;

    private static final String MATCH_ID = "match-xyz";

    private ZSetOperations.TypedTuple<Object> tuple(long universityId, double score) {
        return new ZSetOperations.TypedTuple<>() {
            @Override public Object getValue() { return String.valueOf(universityId); }
            @Override public Double getScore() { return score; }
            @Override public int compareTo(ZSetOperations.TypedTuple<Object> o) {
                return Double.compare(score, o.getScore());
            }
        };
    }

    private UniversityResponse university(long id, String name) {
        return UniversityResponse.builder().id(id).name(name).build();
    }

    @Test
    @DisplayName("Returns top participants in descending score order with correct ranks")
    void showLeaderboard_returnsRankedParticipants() {
        Set<ZSetOperations.TypedTuple<Object>> portResult = new LinkedHashSet<>(List.of(
                tuple(1L, 200.0),
                tuple(2L, 150.0),
                tuple(3L, 100.0)
        ));
        when(leaderboardRedisPort.getParticipants(MATCH_ID)).thenReturn(portResult);
        when(universityServiceImpl.getUniversityById(1L)).thenReturn(university(1L, "MIT"));
        when(universityServiceImpl.getUniversityById(2L)).thenReturn(university(2L, "Harvard"));
        when(universityServiceImpl.getUniversityById(3L)).thenReturn(university(3L, "Stanford"));

        List<ScheduleParticipantResponse> result = leaderboardService.showLeaderboard(MATCH_ID);

        assertThat(result).hasSize(3);

        assertThat(result.get(0).getRank()).isEqualTo(1);
        assertThat(result.get(0).getTotalVotes()).isEqualTo(200);
        assertThat(result.get(0).getUniversityResponse().getName()).isEqualTo("MIT");

        assertThat(result.get(1).getRank()).isEqualTo(2);
        assertThat(result.get(1).getTotalVotes()).isEqualTo(150);

        assertThat(result.get(2).getRank()).isEqualTo(3);
        assertThat(result.get(2).getTotalVotes()).isEqualTo(100);
    }

    @Test
    void showLeaderboard_queriesParticipantsFromPort() {
        when(leaderboardRedisPort.getParticipants(MATCH_ID)).thenReturn(Collections.emptySet());

        leaderboardService.showLeaderboard(MATCH_ID);

        verify(leaderboardRedisPort).getParticipants(MATCH_ID);
    }

    @Test
    void showLeaderboard_usesCorrectMatchId() {
        String customMatchId = "custom-match-42";
        when(leaderboardRedisPort.getParticipants(customMatchId)).thenReturn(Collections.emptySet());

        leaderboardService.showLeaderboard(customMatchId);

        verify(leaderboardRedisPort).getParticipants(customMatchId);
    }

    @Test
    void showLeaderboard_returnsEmptyList_whenPortReturnsNull() {
        when(leaderboardRedisPort.getParticipants(MATCH_ID)).thenReturn(null);

        List<ScheduleParticipantResponse> result = leaderboardService.showLeaderboard(MATCH_ID);

        assertThat(result).isEmpty();
        verifyNoInteractions(universityServiceImpl);
    }

    @Test
    void showLeaderboard_returnsEmptyList_whenPortReturnsEmpty() {
        when(leaderboardRedisPort.getParticipants(MATCH_ID)).thenReturn(Collections.emptySet());

        List<ScheduleParticipantResponse> result = leaderboardService.showLeaderboard(MATCH_ID);

        assertThat(result).isEmpty();
        verifyNoInteractions(universityServiceImpl);
    }

    @Test
    void showLeaderboard_skipsNullTuples() {
        Set<ZSetOperations.TypedTuple<Object>> portResult = new LinkedHashSet<>();
        portResult.add(null);
        portResult.add(tuple(1L, 100.0));
        when(leaderboardRedisPort.getParticipants(MATCH_ID)).thenReturn(portResult);
        when(universityServiceImpl.getUniversityById(1L)).thenReturn(university(1L, "MIT"));

        List<ScheduleParticipantResponse> result = leaderboardService.showLeaderboard(MATCH_ID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRank()).isEqualTo(1);
    }

    @Test
    void showLeaderboard_skipsTupleWithNullValue() {
        ZSetOperations.TypedTuple<Object> nullValueTuple = new ZSetOperations.TypedTuple<>() {
            @Override public Object getValue() { return null; }
            @Override public Double getScore() { return 50.0; }
            @Override public int compareTo(ZSetOperations.TypedTuple<Object> o) { return 0; }
        };
        Set<ZSetOperations.TypedTuple<Object>> portResult = new LinkedHashSet<>(List.of(nullValueTuple));
        when(leaderboardRedisPort.getParticipants(MATCH_ID)).thenReturn(portResult);

        List<ScheduleParticipantResponse> result = leaderboardService.showLeaderboard(MATCH_ID);

        assertThat(result).isEmpty();
        verifyNoInteractions(universityServiceImpl);
    }

    @Test
    void showLeaderboard_defaultsVotesToZero_whenScoreIsNull() {
        ZSetOperations.TypedTuple<Object> nullScoreTuple = new ZSetOperations.TypedTuple<>() {
            @Override public Object getValue() { return "1"; }
            @Override public Double getScore() { return null; }
            @Override public int compareTo(ZSetOperations.TypedTuple<Object> o) { return 0; }
        };
        when(leaderboardRedisPort.getParticipants(MATCH_ID))
                .thenReturn(new LinkedHashSet<>(List.of(nullScoreTuple)));
        when(universityServiceImpl.getUniversityById(1L)).thenReturn(university(1L, "MIT"));

        List<ScheduleParticipantResponse> result = leaderboardService.showLeaderboard(MATCH_ID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTotalVotes()).isEqualTo(0);
    }

    @Test
    @DisplayName("Skips entry when university is not found in UniversityService")
    void showLeaderboard_skipsEntry_whenUniversityNotFound() {
        Set<ZSetOperations.TypedTuple<Object>> portResult = new LinkedHashSet<>(List.of(
                tuple(1L, 200.0),
                tuple(2L, 100.0)
        ));
        when(leaderboardRedisPort.getParticipants(MATCH_ID)).thenReturn(portResult);
        when(universityServiceImpl.getUniversityById(1L)).thenReturn(null);
        when(universityServiceImpl.getUniversityById(2L)).thenReturn(university(2L, "Oxford"));

        List<ScheduleParticipantResponse> result = leaderboardService.showLeaderboard(MATCH_ID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUniversityResponse().getName()).isEqualTo("Oxford");
    }

    @Test
    void showLeaderboard_rankNotIncrementedForSkippedUniversity() {
        Set<ZSetOperations.TypedTuple<Object>> portResult = new LinkedHashSet<>(List.of(
                tuple(1L, 300.0),
                tuple(2L, 200.0),
                tuple(3L, 100.0)
        ));
        when(leaderboardRedisPort.getParticipants(MATCH_ID)).thenReturn(portResult);
        when(universityServiceImpl.getUniversityById(1L)).thenReturn(null);
        when(universityServiceImpl.getUniversityById(2L)).thenReturn(university(2L, "Harvard"));
        when(universityServiceImpl.getUniversityById(3L)).thenReturn(university(3L, "Stanford"));

        List<ScheduleParticipantResponse> result = leaderboardService.showLeaderboard(MATCH_ID);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getRank()).isEqualTo(1);
        assertThat(result.get(1).getRank()).isEqualTo(2);
    }

    @Test
    void showLeaderboard_callsUniversityServiceForEachParticipant() {
        Set<ZSetOperations.TypedTuple<Object>> portResult = new LinkedHashSet<>(List.of(
                tuple(1L, 100.0),
                tuple(2L, 90.0),
                tuple(3L, 80.0)
        ));
        when(leaderboardRedisPort.getParticipants(MATCH_ID)).thenReturn(portResult);
        when(universityServiceImpl.getUniversityById(anyLong()))
                .thenAnswer(inv -> university(inv.getArgument(0), "Uni-" + inv.getArgument(0)));

        leaderboardService.showLeaderboard(MATCH_ID);

        verify(universityServiceImpl, times(3)).getUniversityById(anyLong());
    }
}