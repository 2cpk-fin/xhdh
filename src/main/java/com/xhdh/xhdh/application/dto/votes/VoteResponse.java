package com.xhdh.xhdh.application.dto.votes;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.xhdh.xhdh.domain.models.Vote;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@JsonPropertyOrder({"username", "universityName", "universityAbbreviation", "matchId", "matchTitle", "voteAt"})
public class VoteResponse {
    private final String username;

    private final String universityName;

    private final String universityAbbreviation;

    private final long matchId;

    private final String matchTitle;

    private final LocalDateTime voteAt;

    public VoteResponse(Vote vote) {
        this.username = vote.getUser().getUsername();
        this.universityName = vote.getUniversity().getName();
        this.universityAbbreviation = vote.getUniversity().getAbbreviation();
        this.matchId = vote.getMatch().getId();
        this.matchTitle = vote.getMatch().getTitle();
        this.voteAt = LocalDateTime.now();
    }
}
