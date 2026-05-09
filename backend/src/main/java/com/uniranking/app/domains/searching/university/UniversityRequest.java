package com.uniranking.app.domains.searching.university;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UniversityRequest {
    private String name;
    private String abbreviation;
    private int elo;
    private Set<Tag> tags;
}