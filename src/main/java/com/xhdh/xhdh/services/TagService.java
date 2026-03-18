package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.TagResponse;
import com.xhdh.xhdh.models.Tag;
import com.xhdh.xhdh.models.University;
import com.xhdh.xhdh.repositories.TagRepository;
import com.xhdh.xhdh.repositories.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    private final UniversityRepository universityRepository;

    public ResponseEntity<List<TagResponse>> showAllTags() {
        List<TagResponse> tagResponses = tagRepository.findAll()
                .stream()
                .map(tag -> {
                    TagResponse tagResponse = new TagResponse(tag);
                    tagResponse.setUniversityNames(showAllUniversitiesByTagName(tag.getName()).getBody());
                    return tagResponse;
                })
                .collect(Collectors.toList());

        return new ResponseEntity<>(tagResponses, HttpStatus.OK);
    }

    public ResponseEntity<List<String>> showAllUniversitiesByTagName(String tagName) {
        List<String> universities = universityRepository.findAllByTagName(tagName)
                .stream()
                .map(University::getName)
                .collect(Collectors.toList());

        return new ResponseEntity<>(universities, HttpStatus.OK);
    }
}
