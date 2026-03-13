package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.Match;
import lombok.Getter;

@Getter
public class FinishedMatchResponse extends MatchResponse{
    private final int winnerId;
    private final String winnerName;
    private final long winnerVotes;
    private final int loserId;
    private final String loserName;
    private final long loserVotes;


    public FinishedMatchResponse(Match match) {
        super(match);
        this.winnerId = match.getWinner().getId();
        this.winnerName = match.getWinner().getName();
        this.winnerVotes = match.getTotalWinningVotes();
        this.loserId = match.getLoser().getId();
        this.loserName = match.getLoser().getName();
        this.loserVotes = match.getTotalLosingVotes();
    }
}
