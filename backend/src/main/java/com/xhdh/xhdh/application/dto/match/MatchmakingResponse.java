package com.xhdh.xhdh.application.dto.match;

import com.xhdh.xhdh.domain.models.search.University;

public record MatchmakingResponse(
    University universityA,
    University universityB
) {}