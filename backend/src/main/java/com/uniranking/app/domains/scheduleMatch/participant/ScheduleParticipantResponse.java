package com.uniranking.app.domains.scheduleMatch.participant;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({ "id", "publicUniversityId", "universityName", "totalVotes", "rank" })
public class ScheduleParticipantResponse {
    private long id;

    private UUID publicUniversityId;

    private String universityName;

    private long totalVotes;

    private int rank;
}
