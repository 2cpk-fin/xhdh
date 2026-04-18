package com.xhdh.xhdh.application.dto.match;

import java.time.Instant;
import java.util.UUID;

import com.xhdh.xhdh.application.dto.search.UniversityDTO;
import com.xhdh.xhdh.domain.models.match.Status;

public record MatchResponseDTO(
    UUID matchId,
    String title,
    Status status,
    Instant startTime,
    Instant endTime,
    UniversityDTO u1,
    UniversityDTO u2,
    UUID ownerUUID
) {}

