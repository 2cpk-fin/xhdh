package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.University;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
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
