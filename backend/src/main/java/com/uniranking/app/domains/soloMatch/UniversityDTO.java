package com.uniranking.app.domains.soloMatch;

import java.util.UUID;

public record UniversityDTO(
    UUID id,
    String name,
    String abbreviation,
    int elo
) {}
