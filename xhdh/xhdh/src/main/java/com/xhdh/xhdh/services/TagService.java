package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.TagResponse;
import com.xhdh.xhdh.models.Tag;
import com.xhdh.xhdh.models.University;
import com.xhdh.xhdh.repositories.TagRepository;
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

    public ResponseEntity<List<TagResponse>> showAllTags() {
        List<TagResponse> tagResponses = new ArrayList<>();

        for (Tag tag : tagRepository.findAll()) {
            tagResponses.add(new TagResponse(tag));
        }
        return new ResponseEntity<>(tagResponses, HttpStatus.OK);
    }

    public ResponseEntity<List<TagResponse>> showAllTagsInUniversity(String universityName) {
        List<TagResponse> tagResponses = new ArrayList<>();

        for (Tag tag : tagRepository.findAll()) {
            for (University university : tag.getUniversities()) {
                if (university.getName().equals(universityName)) {
                    tagResponses.add(new TagResponse(tag));
                }

            }
        }
        return new ResponseEntity<>(tagResponses, HttpStatus.OK);
    }
}
