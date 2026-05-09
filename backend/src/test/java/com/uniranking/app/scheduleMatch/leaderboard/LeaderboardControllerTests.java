package com.uniranking.app.scheduleMatch.leaderboard;

import com.uniranking.app.common.BaseControllerTest;
import com.uniranking.app.domains.scheduleMatch.leaderboard.ScheduleMatchLeaderboardController;
import com.uniranking.app.domains.scheduleMatch.leaderboard.ScheduleMatchLeaderboardService;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import com.uniranking.app.domains.searching.university.UniversityResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScheduleMatchLeaderboardController.class)
class LeaderboardControllerTests extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ScheduleMatchLeaderboardService scheduleMatchLeaderboardServiceImpl;

    private ScheduleParticipantResponse buildParticipant(long uniId, String name, int votes, int rank) {
        UniversityResponse uni = UniversityResponse.builder()
                .id(uniId)
                .name(name)
                .build();
        return ScheduleParticipantResponse.builder()
                .universityResponse(uni)
                .totalVotes(votes)
                .rank(rank)
                .build();
    }


    @Test
    void showLeaderboard_returnsOkWithParticipants() throws Exception {
        String matchId = "match-abc";
        List<ScheduleParticipantResponse> participants = List.of(
                buildParticipant(1L, "MIT",     150, 1),
                buildParticipant(2L, "Harvard", 120, 2)
        );
        when(scheduleMatchLeaderboardServiceImpl.showLeaderboard(matchId)).thenReturn(participants);

        mockMvc.perform(get("/api/schedule/match/leaderboard/{publicMatchId}", matchId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].rank").value(1))
                .andExpect(jsonPath("$[0].totalVotes").value(150))
                .andExpect(jsonPath("$[0].universityResponse.name").value("MIT"))
                .andExpect(jsonPath("$[1].rank").value(2))
                .andExpect(jsonPath("$[1].universityResponse.name").value("Harvard"));
    }

    @Test
    void showLeaderboard_returnsEmptyListWhenNoParticipants() throws Exception {
        String matchId = "match-empty";
        when(scheduleMatchLeaderboardServiceImpl.showLeaderboard(matchId)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/schedule/match/leaderboard/{publicMatchId}", matchId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void showLeaderboard_delegatesPublicMatchIdToService() throws Exception {
        String matchId = "unique-match-id-999";
        when(scheduleMatchLeaderboardServiceImpl.showLeaderboard(matchId)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/schedule/match/leaderboard/{publicMatchId}", matchId))
                .andExpect(status().isOk());

        // Mockito verifies that the service was called with the exact path variable
        org.mockito.Mockito.verify(scheduleMatchLeaderboardServiceImpl).showLeaderboard(matchId);
    }

    @Test
    void showLeaderboard_returnsSingleParticipant() throws Exception {
        String matchId = "match-solo";
        List<ScheduleParticipantResponse> participants = List.of(
                buildParticipant(5L, "Stanford", 300, 1)
        );
        when(scheduleMatchLeaderboardServiceImpl.showLeaderboard(matchId)).thenReturn(participants);

        mockMvc.perform(get("/api/schedule/match/leaderboard/{publicMatchId}", matchId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].rank").value(1))
                .andExpect(jsonPath("$[0].totalVotes").value(300));
    }
}