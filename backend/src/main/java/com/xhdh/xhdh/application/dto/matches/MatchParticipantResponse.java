package com.xhdh.xhdh.application.dto.matches;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.xhdh.xhdh.domain.models.MatchParticipant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({"universityName", "totalVotes", "rank"})
public class MatchParticipantResponse {

    private String universityName;

    private long totalVotes;

    private int rank;

    public MatchParticipantResponse() {}

    public MatchParticipantResponse(MatchParticipant matchParticipant) {
        this.universityName = matchParticipant.getUniversity().getName();
        this.totalVotes = matchParticipant.getTotalVotes();
        this.rank = matchParticipant.getRank();
    }
}
