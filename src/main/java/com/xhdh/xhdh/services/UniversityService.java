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
import java.util.UUID;
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

    public UniversityResponse createUniversity(UniversityRequest request) {
        University university = new University();
        university.setPublicUniversityId(UUID.randomUUID());
        university.setName(request.getName());
        university.setAbbreviation(request.getAbbreviation());
        university.setElo(request.getElo());
        University savedUniversity = universityRepository.save(university);
        return new UniversityResponse(savedUniversity);
}
}
