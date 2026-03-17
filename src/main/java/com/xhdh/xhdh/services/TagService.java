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

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    private final UniversityRepository universityRepository;

    public ResponseEntity<List<TagResponse>> showAllTags() {
        List<TagResponse> tagResponses = new ArrayList<>();

        // Using advanced loop to convert all the Entities to TagResponse
        for (Tag tag : tagRepository.findAll()) {
            tagResponses.add(new TagResponse(tag));
        }

        return new ResponseEntity<>(tagResponses, HttpStatus.OK);
    }

    public ResponseEntity<List<String>> showAllUniversitiesByTagName(String tagName) {
        List<String> universities = new ArrayList<>();

        // Using SQL to fetch all the tags from the university_tag table
        for (University university : universityRepository.findAllByTagName(tagName)) {
            universities.add(university.getName());
        }

        return new ResponseEntity<>(universities, HttpStatus.OK);
    }
}
