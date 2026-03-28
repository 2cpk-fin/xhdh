package com.xhdh.xhdh.application.dto.matches;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SoloMatchChoiceRequest(
    @NotNull(message = "User UUID is required") UUID userUUID,
    @NotNull(message = "Solo match UUID is required") UUID matchUUID,
    @NotNull(message = "Chosen university UUID is required") UUID universityUUID
) {}