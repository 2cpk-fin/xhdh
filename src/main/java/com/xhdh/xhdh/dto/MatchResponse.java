package com.xhdh.xhdh.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@JsonPropertyOrder({"id", "title", "status", "participants", "startTime", "endTime"})
public class MatchResponse {
    private final long id;

    private final String title;

    private final String status;

    private final List<MatchParticipantResponse> participants;

    private final LocalDateTime startTime;

    private final LocalDateTime endTime;
}
