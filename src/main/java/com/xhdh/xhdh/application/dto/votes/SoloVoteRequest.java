package com.xhdh.xhdh.application.dto.votes;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SoloVoteRequest(
    @NotNull(message = "User UUID is required")
    UUID userUUID,
    
    @NotNull(message = "Match UUID is required")
    UUID matchUUID,
    
    @NotNull(message = "University UUID is required")
    UUID universityUUID
) {}
