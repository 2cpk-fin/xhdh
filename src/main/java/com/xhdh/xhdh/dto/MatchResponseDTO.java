package com.xhdh.xhdh.dto;

import java.time.LocalDateTime;

public record MatchResponseDTO(
    Long matchId,
    String title,
    String status,
    LocalDateTime startTime,
    LocalDateTime endTime,
    UniversityDTO u1,
    UniversityDTO u2
) {}

