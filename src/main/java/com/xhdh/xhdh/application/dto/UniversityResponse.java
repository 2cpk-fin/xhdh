package com.xhdh.xhdh.application.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.xhdh.xhdh.domain.models.University;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@JsonPropertyOrder({"id", "name", "abbreviation", "tags", "elo"})
public class UniversityResponse {
    private UUID publicUniversityId;
    private final String name;
    private final String abbreviation;
    @Setter
    private List<String> tags;
    private final int elo;

    public UniversityResponse(University university) {
        this.publicUniversityId = university.getPublicUniversityId();
        this.name = university.getName();
        this.abbreviation = university.getAbbreviation();
        this.elo = university.getElo();
    }
}
