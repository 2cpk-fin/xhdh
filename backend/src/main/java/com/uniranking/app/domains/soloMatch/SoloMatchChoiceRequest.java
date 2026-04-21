package com.uniranking.app.domains.soloMatch;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SoloMatchChoiceRequest(
    @NotNull(message = "Solo match UUID is required") UUID matchUUID,
    @NotNull(message = "Chosen university UUID is required") UUID universityUUID
) {}