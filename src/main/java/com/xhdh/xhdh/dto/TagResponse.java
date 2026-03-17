package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.Tag;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class TagResponse {
    private final long id;

    private final String name;

    List<String> universityNames;

    public TagResponse(Tag tag) {
        this.id = tag.getId();
        this.name = tag.getName();
        this.universityNames = new ArrayList<>();
    }
}
