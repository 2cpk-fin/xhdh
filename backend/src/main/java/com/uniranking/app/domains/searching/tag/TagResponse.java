package com.uniranking.app.domains.searching.tag;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonPropertyOrder({ "id", "publicTagId", "name" })
public class TagResponse {
    private long id;

    private UUID publicTagId;

    private String name;
}