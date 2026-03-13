package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.Match;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MatchResponse {
    private final int winnerId;
    private final String winnerName;
    private final long winnerVotes;
    private final int loserId;
    private final String loserName;
    private final long loserVotes;
    private final long totalVotes;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;


    public MatchResponse(Match match) {
        this.winnerId = match.getWinner().getId();
        this.winnerName = match.getWinner().getName();
        this.winnerVotes = match.getTotalWinningVotes();
        this.loserId = match.getLoser().getId();
        this.loserName = match.getLoser().getName();
        this.loserVotes = match.getTotalLosingVotes();
        this.totalVotes = match.getTotalVotes();
        this.startTime = match.getStartTime();
        this.endTime = match.getEndTime();
    }
}
