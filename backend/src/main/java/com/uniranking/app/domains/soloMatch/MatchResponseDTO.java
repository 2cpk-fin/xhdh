package com.uniranking.app.domains.soloMatch;

import java.time.Instant;
import java.util.UUID;

import com.uniranking.app.domains.scheduleMatch.match.Status;

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

