package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.application.dto.search.TagResponse;
import com.xhdh.xhdh.application.mappers.search.TagMapper;
import com.xhdh.xhdh.domain.models.search.University;
import com.xhdh.xhdh.infrastructure.repositories.jpa.TagRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UniversityRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    private final TagMapper tagMapper;

    private final UniversityRepository universityRepository;

    public List<TagResponse> showAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(tag -> {
                    TagResponse tagResponse = tagMapper.toTagResponse(tag);
                    tagResponse.setUniversities(showAllUniversitiesByTagName(tag.getName()));
                    return tagResponse;
                })
                .toList();
    }

    public List<String> showAllUniversitiesByTagName(String tagName) {
        return universityRepository.findAllByTagName(tagName)
                .stream()
                .map(University::getName)
                .toList();
    }
}
