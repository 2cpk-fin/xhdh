package com.uniranking.app.domains.support;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SupportMapper {

    SupportResponse toResponse(Support support);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createTime", ignore = true)
    @Mapping(target = "content", source = "request.content")
    @Mapping(target = "username", source = "username")
    Support toEntity(SupportRequest request, String username);
}