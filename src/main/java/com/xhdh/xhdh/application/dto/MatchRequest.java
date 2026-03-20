package com.xhdh.xhdh.application.dto;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class MatchRequest {
    private String title;

    private String tagName;

    private List<String> participants;

    private LocalDateTime startTime;

    private LocalDateTime endTime;
}
