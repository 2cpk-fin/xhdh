package com.xhdh.xhdh.dto;

import jakarta.validation.constraints.NotBlank;

public record UniversityRequest(
    @NotBlank String name,
    @NotBlank String abbreviation,
    @NotBlank int elo
){
}
