package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.Match;
import lombok.Getter;

@Getter
public class PendingMatchResponse extends MatchResponse {
    private final int leftId;
    private final String leftUniversityName;
    private final long totalLeftVotes;
    private final int rightId;
    private final String rightUniversityName;
    private final long totalRightVotes;

    public PendingMatchResponse(Match match) {
        super(match);
        this.leftId = match.getLeftUniversity().getId();
        this.leftUniversityName = match.getLeftUniversity().getName();
        this.totalLeftVotes = match.getTotalLeftVotes();
        this.rightId = match.getRightUniversity().getId();
        this.rightUniversityName = match.getRightUniversity().getName();
        this.totalRightVotes = match.getTotalRightVotes();
    }
}
