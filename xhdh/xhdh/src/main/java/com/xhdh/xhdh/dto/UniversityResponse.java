package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.University;
import lombok.Getter;

@Getter
public class UniversityResponse {
    private final String name;
    private final String abbreviation;
    private final int elo;

    public UniversityResponse(University university) {
        this.name = university.getName();
        this.abbreviation = university.getAbbreviation();
        this.elo = university.getElo();
    }
}
