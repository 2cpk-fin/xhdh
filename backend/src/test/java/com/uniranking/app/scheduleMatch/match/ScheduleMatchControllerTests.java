package com.uniranking.app.scheduleMatch.match;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uniranking.app.common.BaseControllerTest;
import com.uniranking.app.domains.scheduleMatch.match.*;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScheduleMatchController.class)
class ScheduleMatchControllerTests extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ScheduleMatchService scheduleMatchServiceImpl;

    private ScheduleMatchResponse matchResponse;
    private ScheduleMatchRequest matchRequest;

    @BeforeEach
    void setUp() {
        matchResponse = new ScheduleMatchResponse();
        matchResponse.setId(1L);
        matchResponse.setPublicMatchId(UUID.randomUUID());
        matchResponse.setTitle("Test Match");
        matchResponse.setStatus("PENDING");

        matchRequest = new ScheduleMatchRequest();
        matchRequest.setTitle("Test Match");
        matchRequest.setUniIds(List.of(1L, 2L));
        matchRequest.setStartTime(LocalDateTime.now().plusDays(1));
        matchRequest.setEndTime(LocalDateTime.now().plusDays(2));
    }

    @Test
    void getScheduledMatchesNotStarted_ReturnsOk() throws Exception {
        when(scheduleMatchServiceImpl.getAllNotStartedMatches()).thenReturn(List.of(matchResponse));

        mockMvc.perform(get("/api/schedule/match/all/not-started"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void getScheduledPendingMatches_ReturnsOk() throws Exception {
        when(scheduleMatchServiceImpl.getAllPendingMatches()).thenReturn(List.of(matchResponse));

        mockMvc.perform(get("/api/schedule/match/all/pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void getScheduledFinishedMatches_ReturnsOk() throws Exception {
        when(scheduleMatchServiceImpl.getAllFinishedMatches()).thenReturn(List.of(matchResponse));

        mockMvc.perform(get("/api/schedule/match/all/finished"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void getScheduledMatchParticipant_ReturnsOk() throws Exception {
        when(scheduleMatchServiceImpl.getAllParticipants(1L)).thenReturn(List.of(new ScheduleParticipantResponse()));

        mockMvc.perform(get("/api/schedule/match/1/participants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(username = "user1")
    void vote_ReturnsOk() throws Exception {
        doNothing().when(scheduleMatchServiceImpl).vote(anyLong(), any(String.class), any());

        mockMvc.perform(patch("/api/schedule/match/votes")
                        .param("publicMatchId", UUID.randomUUID().toString())
                        .param("universityId", "1")
                        .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    void getAllMatches_ReturnsOk() throws Exception {
        Page<ScheduleMatchResponse> page = new PageImpl<>(List.of(matchResponse));
        when(scheduleMatchServiceImpl.getAllMatches(anyInt(), anyInt())).thenReturn(page);

        mockMvc.perform(get("/api/schedule/match/admin/get")
                        .param("pageNo", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1));
    }

    @Test
    void createScheduledMatch_ReturnsCreated() throws Exception {
        when(scheduleMatchServiceImpl.createMatch(any(ScheduleMatchRequest.class))).thenReturn(matchResponse);

        mockMvc.perform(post("/api/schedule/match/admin/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(matchRequest))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void updateScheduledMatch_ReturnsOk() throws Exception {
        when(scheduleMatchServiceImpl.updateMatchById(eq(1L), any(ScheduleMatchRequest.class))).thenReturn(matchResponse);

        mockMvc.perform(patch("/api/schedule/match/admin/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(matchRequest))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void deleteScheduledMatch_ReturnsOk() throws Exception {
        when(scheduleMatchServiceImpl.deleteMatchById(1L)).thenReturn("Deleted");

        mockMvc.perform(delete("/api/schedule/match/admin/delete/1")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Deleted"));
    }
}