package com.xhdh.xhdh.application.dto.search;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "universities"})
public class TagResponse {

    private UUID id;

    private String name;

    private List<String> universities;
}