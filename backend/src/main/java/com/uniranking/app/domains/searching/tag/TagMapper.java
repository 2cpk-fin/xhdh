package com.uniranking.app.domains.searching.tag;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TagMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "publicTagId", target = "publicId")
    @Mapping(target = "universities", ignore = true)
    TagResponse toTagResponse(Tag tag);
}
