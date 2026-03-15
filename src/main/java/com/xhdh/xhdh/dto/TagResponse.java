package com.xhdh.xhdh.dto;

import com.xhdh.xhdh.models.Tag;
import lombok.Getter;

@Getter
public class TagResponse {
    private final String name;

    public TagResponse(Tag tag) {
        this.name = tag.getName();
    }
}
