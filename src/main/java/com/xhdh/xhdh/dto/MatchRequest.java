package com.xhdh.xhdh.dto;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Getter
public class MatchRequest {
    private String title;
    private String tagName;
    private int numberOfParticipants;
    private ArrayList<UniversityRequest> participants;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
