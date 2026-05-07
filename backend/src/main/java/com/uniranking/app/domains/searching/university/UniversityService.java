package com.uniranking.app.domains.searching.university;

import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
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
        return universityRepository.findByInput(pageable, input, tagIds).map(universityMapper::mapToResponseWithTags);
    }

    // NOTE: Redis does not speak Java, it speaks String -> beware of handling Java Object to Redis
    @Cacheable(value = "universities", key = "#id")
    public UniversityResponse getUniversityById(Long id) {
        University university = universityRepository.findById(id).orElseThrow(() -> new RuntimeException("University not found"));
        return universityMapper.mapToResponseWithTags(university);
    }

    @CacheEvict(value = "universities", key = "#id")
    public UniversityResponse createUniversity(UniversityRequest universityRequest) {
        University university = universityMapper.toUniversity(universityRequest, new University());
        universityRepository.save(university);
        return universityMapper.mapToResponseWithTags(university);
    }

    @CachePut(value = "universities", key = "#id")
    public UniversityResponse updateUniversityById(Long id, UniversityRequest universityRequest) {
        University university = universityRepository.findById(id).orElseThrow(() -> new RuntimeException("University not found"));
        universityMapper.toUniversity(universityRequest, university);
        universityRepository.save(university);
        return universityMapper.mapToResponseWithTags(university);
    }

    @CacheEvict(value = "universities", key = "#id")
    public String deleteUniversityById(Long id) {
        universityRepository.deleteById(id);
        return "Deleted successfully!";
    }
}
