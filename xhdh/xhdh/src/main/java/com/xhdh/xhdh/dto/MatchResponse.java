package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.Match;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MatchResponse {
    private int universityId;
    private String universityName;
    private String tag;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public MatchResponse(Match match) {

    }
}
