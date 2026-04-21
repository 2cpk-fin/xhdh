package com.uniranking.app.domains.scheduleMatch.participant;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({"id", "universityName", "totalVotes", "rank"})
public class ScheduleParticipantResponse {
    private UUID id;

    private String universityName;

    private long totalVotes;

    private int rank;
}
