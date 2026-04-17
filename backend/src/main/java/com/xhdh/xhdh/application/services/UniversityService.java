package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.application.dto.searches.UniversityResponse;
import com.xhdh.xhdh.domain.models.Tag;
import com.xhdh.xhdh.domain.models.University;
import com.xhdh.xhdh.infrastructure.repositories.jpa.TagRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UniversityRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityService {
    private final TagRepository tagRepository;

    private final UniversityRepository universityRepository;

    public Page<UniversityResponse> getUniversityList(Pageable pageable) {
        return universityRepository.findUniversityList(pageable)
                .map(university -> {
                    UniversityResponse universityResponse = new UniversityResponse(university);
                    universityResponse.setTags(showAllTagsInUniversity(university.getName()));
                    return universityResponse;
                });
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
}
