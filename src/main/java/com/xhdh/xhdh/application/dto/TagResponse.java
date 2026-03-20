package com.xhdh.xhdh.application.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.xhdh.xhdh.domain.models.Tag;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@JsonPropertyOrder({"id", "name", "universityNames"})
public class TagResponse {
    private final long id;

    private final String name;

    @Setter
    List<String> universityNames;

    public TagResponse(Tag tag) {
        this.id = tag.getId();
        this.name = tag.getName();
    }
}
