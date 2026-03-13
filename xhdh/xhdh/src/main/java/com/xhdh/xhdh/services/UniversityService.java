package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.UniversityResponse;
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

    public List<ResponseEntity<UniversityResponse>> getUniversityList() {
        List<University> universityList = universityRepository.findAll();
        List<ResponseEntity<UniversityResponse>> universityResponseList = new ArrayList<>();

        for (University university : universityList) {
            ResponseEntity<UniversityResponse> universityResponse = new ResponseEntity<>(new UniversityResponse(university), HttpStatus.OK);
            universityResponseList.add(universityResponse);
        }
        return universityResponseList;
    }

    public ResponseEntity<UniversityResponse> getUniversityByName(String universityName) {
        University university = universityRepository.findByName(universityName);
        return new ResponseEntity<>(new UniversityResponse(university), HttpStatus.OK);
    }

    public ResponseEntity<UniversityResponse> getUniversityByAbbreviation(String universityAbbreviation) {
        University university = universityRepository.findByAbbreviation(universityAbbreviation);
        return new ResponseEntity<>(new UniversityResponse(university), HttpStatus.OK);
    }
}
