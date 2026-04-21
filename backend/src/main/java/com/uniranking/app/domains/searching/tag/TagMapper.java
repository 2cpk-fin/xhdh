package com.uniranking.app.domains.searching.tag;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TagMapper {
    @Mapping(source = "publicTagId", target = "id")
    @Mapping(target = "universities", ignore = true)
    TagResponse toTagResponse(Tag tag);
}
