package com.uniranking.app.domains.searching.tag;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TagMapper {

    TagResponse toTagResponse(Tag tag);

}
