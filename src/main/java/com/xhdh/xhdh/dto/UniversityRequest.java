package com.xhdh.xhdh.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UniversityRequest {
    private long id;

    private String name;

    private String abbreviation;

    private int elo;
}
