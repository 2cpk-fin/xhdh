package com.uniranking.app.domains.searching.university;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonPropertyOrder({ "id", "publicUniversityId", "name", "abbreviation", "tags", "elo" })
public class UniversityResponse {
    private long id;
    private UUID publicUniversityId;
    private String name;
    private String abbreviation;
    private Set<Tag> tags;
    private int elo;
}