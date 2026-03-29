package com.xhdh.xhdh.application.dto.matches;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.xhdh.xhdh.domain.models.MatchParticipant;
import lombok.Getter;

@Getter
@JsonPropertyOrder({"universityName", "totalVotes", "rank"})
public class MatchParticipantResponse {

    private final String universityName;

    private final long totalVotes;

    private final int rank;

    public MatchParticipantResponse(MatchParticipant matchParticipant) {
        this.universityName = matchParticipant.getUniversity().getName();
        this.totalVotes = matchParticipant.getTotalVotes();
        this.rank = matchParticipant.getRank();
    }
}
