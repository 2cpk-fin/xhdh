package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.UniversityResponse;
import com.xhdh.xhdh.models.Tag;
import com.xhdh.xhdh.models.University;
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

        return new ResponseEntity<>(new UniversityResponse(university), HttpStatus.OK);
    }

    public ResponseEntity<UniversityResponse> getUniversityByAbbreviation(String universityAbbreviation) {
        University university = universityRepository.findByAbbreviation(universityAbbreviation);
        return new ResponseEntity<>(new UniversityResponse(university), HttpStatus.OK);
    }

    public ResponseEntity<List<UniversityResponse>> getAllUniversitiesByTag(String tagName) {
        List<University> universities = universityRepository.findAllByTagName(tagName);
        if (universities == null || universities.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        List<UniversityResponse> universityResponseList = new ArrayList<>();
        for (University university : universities) {
            UniversityResponse response = new UniversityResponse(university);
            universityResponseList.add(response);
        }
        return new ResponseEntity<>(universityResponseList, HttpStatus.OK);
    }
}
