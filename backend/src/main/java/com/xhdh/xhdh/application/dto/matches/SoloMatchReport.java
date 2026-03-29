package com.xhdh.xhdh.application.dto.matches;

import java.util.UUID;

public record SoloMatchReport(
    UUID winnerId,
    UUID loserId,
    int eloChange
) {}