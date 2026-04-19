package com.xhdh.xhdh.application.mappers.search;

import com.xhdh.xhdh.application.dto.search.TagResponse;
import com.xhdh.xhdh.domain.models.search.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TagMapper {
    @Mapping(source = "publicTagId", target = "id")
    @Mapping(target = "universities", ignore = true)
    TagResponse toTagResponse(Tag tag);
}
