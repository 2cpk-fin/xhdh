package com.xhdh.xhdh.application.dto.matches;

import com.xhdh.xhdh.domain.models.University;

public record MatchmakingResponse(
    University universityA,
    University universityB
) {}