package com.xhdh.xhdh.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class MatchResponse {
    private final String title;
    private final String status;
    private final List<MatchParticipantResponse> participants;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
}
