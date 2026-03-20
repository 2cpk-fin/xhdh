package com.xhdh.xhdh.application.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;

public record ScheduledMatchmakingRequest(
    String tagName, 
    String title,
    int participants,
    ArrayList<String> uniList,
    LocalDateTime startDate,
    LocalDateTime endDate    
){    
}
