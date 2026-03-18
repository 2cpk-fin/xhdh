package com.xhdh.xhdh.dto;

import java.time.LocalDateTime;

import com.xhdh.xhdh.models.Status;

public record MatchResponseDTO(
    Long matchId,
    String title,
    Status status,
    LocalDateTime startTime,
    LocalDateTime endTime,
    UniversityDTO u1,
    UniversityDTO u2
) {}

