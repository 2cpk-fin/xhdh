package com.uniranking.app.domains.scheduleMatch.match;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({"id", "title", "status", "participants", "startTime", "endTime"})
public class ScheduleMatchResponse {
    private UUID id;

    private String title;

    private String status;

    private List<ScheduleParticipantResponse> participants;

    private LocalDateTime startTime;

    private LocalDateTime endTime;
}
