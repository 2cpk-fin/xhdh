package com.uniranking.app.domains.searching.university;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface UniversityService {
    List<String> getAllAvailableTags();
    Set<Tag> getTagsByUniversityId(Long id);
    Page<UniversityResponse> getUniversityListByInput(Pageable pageable, String input, List<Tag> tags);
    UniversityResponse getUniversityById(Long id);
    UniversityResponse createUniversity(UniversityRequest universityRequest);
    UniversityResponse updateUniversityById(Long id, UniversityRequest universityRequest);
    String deleteUniversityById(Long id);
}