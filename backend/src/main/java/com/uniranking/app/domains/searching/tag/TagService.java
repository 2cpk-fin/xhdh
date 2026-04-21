package com.uniranking.app.domains.searching.tag;

import com.uniranking.app.domains.searching.university.University;
import com.uniranking.app.domains.searching.university.UniversityRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    private final TagMapper tagMapper;

    private final UniversityRepository universityRepository;

    public List<TagResponse> showAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(tag -> {
                    TagResponse tagResponse = tagMapper.toTagResponse(tag);
                    tagResponse.setUniversities(showAllUniversitiesByTagName(tag.getName()));
                    return tagResponse;
                })
                .toList();
    }

    public List<String> showAllUniversitiesByTagName(String tagName) {
        return universityRepository.findAllByTagName(tagName)
                .stream()
                .map(University::getName)
                .toList();
    }
}
