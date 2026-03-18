package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.University;

public record MatchmakingResponse(
    University universityA,
    University universityB
) {}