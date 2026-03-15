package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.Match;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MatchResponse {
    private final long totalVotes;
    private final String status;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;

    public MatchResponse(Match match) {
        totalVotes = match.getTotalVotes();
        status = match.getStatus();
        startTime = match.getStartTime();
        endTime = match.getEndTime();
    }
}
