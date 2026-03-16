package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.Vote;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class VoteResponse {
    private final String username;
    private final String universityName;
    private final String universityAbbreviation;
    private final String tagName;
    private final long matchId;
    private final String matchTitle;
    private final LocalDateTime voteAt;

    public VoteResponse(Vote vote) {
        this.username = vote.getUser().getUsername();
        this.universityName = vote.getUniversity().getName();
        this.universityAbbreviation = vote.getUniversity().getAbbreviation();
        this.tagName = vote.getTag().getName();
        this.matchId = vote.getMatch().getId();
        this.matchTitle = vote.getMatch().getTitle();
        this.voteAt = LocalDateTime.now();
    }
}
