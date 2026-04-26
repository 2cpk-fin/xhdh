package com.uniranking.app.domains.searching.university;

import com.uniranking.app.domains.searching.tag.*;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UniversityService {
    private final UniversityRepository universityRepository;

    private final UniversityMapper universityMapper;

    public Page<UniversityResponse> getUniversityListByInput(Pageable pageable, String input, List<Long> tagIds) {
        return universityRepository.findByInput(pageable, input, tagIds)
                .map(universityMapper::mapToResponseWithTags);
    }
}
