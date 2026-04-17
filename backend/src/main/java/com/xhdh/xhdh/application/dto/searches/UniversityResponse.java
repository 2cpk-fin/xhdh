package com.xhdh.xhdh.application.dto.searches;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.xhdh.xhdh.domain.models.University;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@JsonPropertyOrder({"publicUniversityId", "name", "abbreviation", "tags", "elo"})
public class UniversityResponse {
    private final UUID publicUniversityId;

    private final String name;

    private final String abbreviation;

    private List<String> tags;

    private final int elo;

    public UniversityResponse(University university) {
        this.publicUniversityId = university.getPublicUniversityId();
        this.name = university.getName();
        this.abbreviation = university.getAbbreviation();
        this.elo = university.getElo();
    }
}
