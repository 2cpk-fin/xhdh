package com.uniranking.app.domains.searching.university;

import com.uniranking.app.domains.searching.exceptions.UniversityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

// TODO: Write tests for new uni and solo domains
@Service
@RequiredArgsConstructor
public class UniversityServiceImpl implements UniversityService {

    private final UniversityRepository universityRepository;
    private final UniversityMapper universityMapper;

    @Override
    public List<String> getAllAvailableTags() {
        return Arrays.stream(Tag.values())
                .map(Enum::name)
                .toList();
    }

    @Override
    public Set<Tag> getTagsByUniversityId(Long id) {
        if (!universityRepository.existsById(id)) {
            throw new UniversityNotFoundException("University not found with ID: " + id);
        }
        return universityRepository.findTagsByUniversityId(id);
    }

    @Override
    public List<UniversityResponse> getAllUniversities() {
        return universityRepository.findAllWithTags().stream()
                .map(universityMapper::toUniversityResponse)
                .toList();
    }

    @Override
    public Page<UniversityResponse> getUniversityListByInput(Pageable pageable, String input, List<Tag> tags) {
        return universityRepository.findByInput(pageable, input, tags)
                .map(universityMapper::toUniversityResponse);
    }

    @Override
    @Cacheable(value = "universities", key = "#id")
    public UniversityResponse getUniversityById(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new UniversityNotFoundException("University not found with ID: " + id));
        return universityMapper.toUniversityResponse(university);
    }

    @Override
    @CachePut(value = "universities", key = "#result.id")
    public UniversityResponse createUniversity(UniversityRequest universityRequest) {
        University university = universityMapper.toUniversity(universityRequest);
        University savedUniversity = universityRepository.save(university);
        return universityMapper.toUniversityResponse(savedUniversity);
    }

    @Override
    @CachePut(value = "universities", key = "#id")
    public UniversityResponse updateUniversityById(Long id, UniversityRequest universityRequest) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new UniversityNotFoundException("University not found with ID: " + id));
        universityMapper.updateUniversityFromRequest(universityRequest, university);
        University savedUniversity = universityRepository.save(university);
        return universityMapper.toUniversityResponse(savedUniversity);
    }

    @Override
    @CacheEvict(value = "universities", key = "#id")
    public String deleteUniversityById(Long id) {
        if (!universityRepository.existsById(id)) {
            throw new UniversityNotFoundException("University not found with ID: " + id);
        }
        universityRepository.deleteById(id);
        return "Deleted successfully!";
    }

    @CachePut(value = "universities", key = "#response.id")
    public UniversityResponse cacheUniversity(UniversityResponse response) {
        return response;
    }
}