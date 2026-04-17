package com.xhdh.xhdh.application.dto.matches;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.xhdh.xhdh.domain.models.MatchParticipant;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@JsonPropertyOrder({"publicUniversityId", "universityName", "totalVotes", "rank"})
public class ParticipantResponse {
    private UUID publicUniversityId;

    private String universityName;

    private long totalVotes;

    private int rank;

    public ParticipantResponse() {}

    public ParticipantResponse(MatchParticipant matchParticipant) {
        this.publicUniversityId = matchParticipant.getPublicParticipantId();
        this.universityName = matchParticipant.getUniversity().getName();
        this.totalVotes = matchParticipant.getTotalVotes();
        this.rank = matchParticipant.getRank();
    }
}
