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

    public List<ResponseEntity<TagResponse>> showAllTags() {
        List<Tag> tags = tagRepository.findAll();
        List<ResponseEntity<TagResponse>> tagResponses = new ArrayList<>();
        for (Tag tag : tags) {
            tagResponses.add(new ResponseEntity<>(new TagResponse(tag), HttpStatus.OK));
        }
        return tagResponses;
    }

    public List<ResponseEntity<TagResponse>> showAllTagsInUniversity(String universityName) {
        List<Tag> tags = tagRepository.findAll();
        List<ResponseEntity<TagResponse>> tagResponses = new ArrayList<>();
        for (Tag tag : tags) {
            for (University university : tag.getUniversities()) {
                if (university.getName().equals(universityName)) {
                    tagResponses.add(new ResponseEntity<>(new TagResponse(tag), HttpStatus.OK));
                }
            }
        }
        return tagResponses;
    }
}
