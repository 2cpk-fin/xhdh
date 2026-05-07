package com.uniranking.app.domains.searching.university;

import com.uniranking.app.domains.searching.tag.Tag;
import com.uniranking.app.domains.searching.tag.TagRepository;
import com.uniranking.app.domains.searching.tag.TagService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class UniversityMapper {
    @Autowired
    protected TagService tagService;

    @Autowired
    protected TagRepository tagRepository;

    public University toUniversity(UniversityRequest universityRequest, University university) {
        university.setName(universityRequest.getName());
        university.setAbbreviation(universityRequest.getAbbreviation());
        university.setElo(universityRequest.getElo());

        List<Tag> tags = universityRequest.getTagIds()
                .stream()
                .map(tagId -> tagRepository.findById(tagId).orElseThrow(() -> new RuntimeException("Tag not found")))
                .toList();
        university.setTags(tags);

        return university;
    }

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
