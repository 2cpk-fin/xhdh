package com.uniranking.app.domains.searching.university;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({ "id", "publicId", "name", "abbreviation", "tags", "elo" })
public class UniversityResponse {
    private long id;

    private UUID publicId;

    private String name;

    private String abbreviation;

    private List<String> tags;

    private int elo;
}
