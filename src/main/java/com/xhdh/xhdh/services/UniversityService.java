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

@Service
@RequiredArgsConstructor
public class UniversityService {
    private final TagRepository tagRepository;

    private final UniversityRepository universityRepository;

    public ResponseEntity<List<UniversityResponse>> getUniversityList() {
        List<UniversityResponse> universityResponseList = new ArrayList<>();

        for (University university : universityRepository.findAll()) {
            UniversityResponse universityResponse = new UniversityResponse(university);
            universityResponseList.add(universityResponse);
        }
        return new ResponseEntity<>(universityResponseList, HttpStatus.OK);
    }

    public ResponseEntity<UniversityResponse> getUniversityByName(String universityName) {
        University university = universityRepository.findByName(universityName);
        UniversityResponse universityResponse = new UniversityResponse(university);
        return new ResponseEntity<>(universityResponse, HttpStatus.OK);
    }

    public ResponseEntity<UniversityResponse> getUniversityByAbbreviation(String universityAbbreviation) {
        University university = universityRepository.findByAbbreviation(universityAbbreviation);
        UniversityResponse universityResponse = new UniversityResponse(university);
        return new ResponseEntity<>(universityResponse, HttpStatus.OK);
    }

    public ResponseEntity<List<String>> showAllTagsInUniversity(String universityName) {
        List<String> tags = new ArrayList<>();

        for (Tag tag : tagRepository.findAllByUniversityName(universityName)) {
            tags.add(tag.getName());
        }

        return new ResponseEntity<>(tags, HttpStatus.OK);
    }
}
