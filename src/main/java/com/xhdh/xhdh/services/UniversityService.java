package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.UniversityRequest;
import com.xhdh.xhdh.dto.UniversityResponse;
import com.xhdh.xhdh.models.Tag;
import com.xhdh.xhdh.models.University;
import com.xhdh.xhdh.repositories.TagRepository;
import com.xhdh.xhdh.repositories.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityService {
    private final TagRepository tagRepository;

    private final UniversityRepository universityRepository;

    public List<UniversityResponse> getUniversityList() {
        return universityRepository.findAll()
                .stream()
                .map(university -> {
                    UniversityResponse universityResponse = new UniversityResponse(university);
                    universityResponse.setTags(showAllTagsInUniversity(university.getName()));
                    return universityResponse;
                })
                .collect(Collectors.toList());
    }

    public UniversityResponse getUniversityByName(String universityName) {
        University university = universityRepository.findByName(universityName);
        UniversityResponse universityResponse = new UniversityResponse(university);
        universityResponse.setTags(showAllTagsInUniversity(university.getName()));

        return universityResponse;
    }

    public List<String> showAllTagsInUniversity(String universityName) {
        return tagRepository.findAllByUniversityName(universityName)
                .stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
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
