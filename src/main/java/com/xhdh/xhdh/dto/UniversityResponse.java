package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.University;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
public class UniversityResponse {
    private final long id;

    private final String name;

    private final String abbreviation;

    @Setter
    private List<String> tags;

    private final int elo;

    public UniversityResponse(University university) {
        this.id = university.getId();
        this.name = university.getName();
        this.abbreviation = university.getAbbreviation();
        this.elo = university.getElo();
    }
}
