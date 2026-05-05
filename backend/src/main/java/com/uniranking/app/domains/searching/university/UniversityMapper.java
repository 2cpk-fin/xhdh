package com.uniranking.app.domains.searching.university;

import com.uniranking.app.domains.searching.tag.TagService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class UniversityMapper {
    @Autowired
    protected TagService tagService;

    @Mapping(target = "tags", ignore = true)
    public abstract UniversityResponse toUniversityResponse(University university);

    // main
    public UniversityResponse mapToResponseWithTags(University university) {
        if (university == null) {
            return null;
        }

        UniversityResponse response = toUniversityResponse(university);
        response.setTags(tagService.showAllTagsInUniversity(university.getId()));
        return response;
    }
}
