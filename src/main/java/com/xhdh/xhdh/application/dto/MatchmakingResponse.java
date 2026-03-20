package com.xhdh.xhdh.application.dto;

import com.xhdh.xhdh.domain.models.University;

public record MatchmakingResponse(
    University universityA,
    University universityB
) {}