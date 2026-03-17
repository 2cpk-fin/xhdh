package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.University;

import jakarta.validation.constraints.NotNull;

public record MatchmakingResponse(
    @NotNull University u1, 
    @NotNull University u2) {
}
