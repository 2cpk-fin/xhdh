package com.uniranking.app.domains.soloMatch;

import java.util.UUID;

public record SoloMatchReport(
    UUID winnerId,
    UUID loserId,
    int eloChange
) {}