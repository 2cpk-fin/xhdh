package com.uniranking.app.domains.searching.university;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UniversityMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicUniversityId", ignore = true)
    University toUniversity(UniversityRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicUniversityId", ignore = true)
    void updateUniversityFromRequest(UniversityRequest request, @MappingTarget University university);

    UniversityResponse toUniversityResponse(University university);
}