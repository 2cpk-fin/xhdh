package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.UniversityRequest;
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
        List<UniversityResponse> universityResponseList = new ArrayList<>();

        for (University university : universityRepository.findAll()) {
            for (Tag tag : university.getTags()) {
                if (tag.getName().equals(tagName)) {
                    universityResponseList.add(new UniversityResponse(university));
                }
            }
        }
        return new ResponseEntity<>(universityResponseList, HttpStatus.OK);
    }

    public ResponseEntity<UniversityResponse> createUniversity(UniversityRequest universityRequest) {
        University university = new University();
        university.setName(universityRequest.name());
        university.setAbbreviation(universityRequest.abbreviation());
        university.setElo(universityRequest.elo());

        University savedUniversity = universityRepository.save(university);
        return new ResponseEntity<>(new UniversityResponse(savedUniversity), HttpStatus.CREATED);
    }
}
