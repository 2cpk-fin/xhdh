package com.xhdh.xhdh.application.dto.votes;

import jakarta.validation.constraints.NotBlank;

public record VoteRequest(
    @NotBlank long userId,
    @NotBlank long universityId,
    @NotBlank long matchId
){}
