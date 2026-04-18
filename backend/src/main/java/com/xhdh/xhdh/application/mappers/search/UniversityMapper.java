package com.xhdh.xhdh.application.mappers.search;

import com.xhdh.xhdh.application.dto.search.UniversityResponse;
import com.xhdh.xhdh.domain.models.search.University;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UniversityMapper {
    @Mapping(source = "publicUniversityId", target = "id")
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "participants", ignore = true)
    UniversityResponse toUniversityResponse(University university);
}
