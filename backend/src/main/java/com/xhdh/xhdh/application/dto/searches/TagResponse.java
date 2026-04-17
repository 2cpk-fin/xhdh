package com.xhdh.xhdh.application.dto.searches;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.xhdh.xhdh.domain.models.Tag;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@JsonPropertyOrder({"publicTagId", "name", "universityNames"})
public class TagResponse {
    private final UUID publicTagId;

    private final String name;

    List<String> universityNames;

    public TagResponse(Tag tag) {
        this.publicTagId = tag.getPublicTagId();
        this.name = tag.getName();
    }
}
