package com.xhdh.xhdh.application.dto;

import java.time.Instant;
import java.util.UUID;

import com.xhdh.xhdh.domain.models.Status;

public record MatchResponseDTO(
    UUID matchId,
    String title,
    Status status,
    Instant startTime,
    Instant endTime,
    UniversityDTO u1,
    UniversityDTO u2
) {}

