package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.MatchParticipant;
import lombok.Getter;

@Getter
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
