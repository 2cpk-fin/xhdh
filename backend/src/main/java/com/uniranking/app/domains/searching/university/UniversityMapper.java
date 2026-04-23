package com.uniranking.app.domains.searching.university;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UniversityMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "publicUniversityId", target = "publicId")
    @Mapping(target = "tags", ignore = true)
    UniversityResponse toUniversityResponse(University university);
}
