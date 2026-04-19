package com.xhdh.xhdh.application.dto.match;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
@JsonPropertyOrder({"publicMatchId", "matchId", "title", "status", "participants", "startTime", "endTime"})
public class ScheduleMatchResponse {
    private final UUID publicMatchId;

    private final Long matchId;

    private final String title;

    private final String status;

    private final List<ParticipantResponse> participants;

    private final LocalDateTime startTime;

    private final LocalDateTime endTime;
}
