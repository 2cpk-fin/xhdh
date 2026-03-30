package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.application.dto.searches.TagResponse;
import com.xhdh.xhdh.domain.models.University;
import com.xhdh.xhdh.infrastructure.repositories.jpa.TagRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UniversityRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    private final UniversityRepository universityRepository;

    public List<TagResponse> showAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(tag -> {
                    TagResponse tagResponse = new TagResponse(tag);
                    tagResponse.setUniversityNames(showAllUniversitiesByTagName(tag.getName()));
                    return tagResponse;
                })
                .collect(Collectors.toList());
    }

    public List<String> showAllUniversitiesByTagName(String tagName) {
        return universityRepository.findAllByTagName(tagName)
                .stream()
                .map(University::getName)
                .collect(Collectors.toList());
    }
}
