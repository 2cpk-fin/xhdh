package com.uniranking.app.domains.searching.university;

import com.uniranking.app.domains.searching.tag.Tag;
import com.uniranking.app.domains.searching.tag.TagRepository;

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

    private final UniversityMapper universityMapper;

    // Helper function
    private UniversityResponse mapToResponseWithTags(University university) {
        if (university == null) return null;
        UniversityResponse response = universityMapper.toUniversityResponse(university);
        response.setTags(showAllTagsInUniversity(university.getName()));
        return response;
    }

    public Page<UniversityResponse> getUniversityList(Pageable pageable) {
        return universityRepository.findUniversityList(pageable)
                .map(this::mapToResponseWithTags);
    }

    public UniversityResponse getUniversityByName(String universityName) {
        University university = universityRepository.findByName(universityName);
        return mapToResponseWithTags(university);
    }

    public List<String> showAllTagsInUniversity(String universityName) {
        return tagRepository.findAllByUniversityName(universityName)
                .stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
    }
}
