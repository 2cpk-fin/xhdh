package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.UniversityResponse;
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
public class UniversityService {
    private final TagRepository tagRepository;

    private final UniversityRepository universityRepository;

    public ResponseEntity<List<UniversityResponse>> getUniversityList() {
        List<UniversityResponse> universityResponseList = universityRepository.findAll()
                .stream()
                .map(university -> {
                    UniversityResponse universityResponse = new UniversityResponse(university);
                    universityResponse.setTags(showAllTagsInUniversity(university.getName()).getBody());
                    return universityResponse;
                })
                .collect(Collectors.toList());

        return new ResponseEntity<>(universityResponseList, HttpStatus.OK);
    }

    public ResponseEntity<UniversityResponse> getUniversityByName(String universityName) {
        University university = universityRepository.findByName(universityName);
        UniversityResponse universityResponse = new UniversityResponse(university);
        universityResponse.setTags(showAllTagsInUniversity(university.getName()).getBody());

        return new ResponseEntity<>(universityResponse, HttpStatus.OK);
    }

    public ResponseEntity<List<String>> showAllTagsInUniversity(String universityName) {
        List<String> tags = tagRepository.findAllByUniversityName(universityName)
                .stream()
                .map(Tag::getName)
                .collect(Collectors.toList());

        return new ResponseEntity<>(tags, HttpStatus.OK);
    }
}
