package com.uniranking.app.domains.searching.university;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.uniranking.app.domains.searching.tag.TagResponse;
import lombok.*;

import java.util.List;
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

    private List<TagResponse> tags;

    private int elo;
}
