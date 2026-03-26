package com.xhdh.xhdh.application.dto.searches;

import java.util.UUID;

public record UniversityDTO(
    UUID id,
    String name,
    String abbreviation,
    int elo
) {}
