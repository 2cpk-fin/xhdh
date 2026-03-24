package com.xhdh.xhdh.application.dto;

import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
public class MatchRequest {
    private String title;

    private String tagName;

    private List<String> participants;

    private Instant startTime;

    private Instant endTime;
}
