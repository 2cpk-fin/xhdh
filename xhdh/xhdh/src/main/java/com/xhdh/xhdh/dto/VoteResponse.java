package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.Vote;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class VoteResponse {
    private final long id;
    private final long userId;
    private final int universityId;
    private final String universityName;
    private final String universityAbbreviation;
    private final int tagId;
    private final String tagName;
    private final long matchId;
    private final LocalDateTime voteAt;

    public VoteResponse(Vote vote) {
        this.id = vote.getId();
        this.userId = vote.getUser().getId();
        this.universityId = vote.getUniversity().getId();
        this.universityName = vote.getUniversity().getName();
        this.universityAbbreviation = vote.getUniversity().getAbbreviation();
        this.tagId = vote.getTag().getId();
        this.tagName = vote.getTag().getName();
        this.matchId = vote.getMatch().getId();
        this.voteAt = LocalDateTime.now();
    }
}
