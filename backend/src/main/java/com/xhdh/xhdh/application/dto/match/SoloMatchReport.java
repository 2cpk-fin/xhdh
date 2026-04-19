package com.xhdh.xhdh.application.dto.match;

import java.util.UUID;

public record SoloMatchReport(
    UUID winnerId,
    UUID loserId,
    int eloChange
) {}