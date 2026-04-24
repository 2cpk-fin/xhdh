package com.uniranking.app.domains.searching.tag;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    private final TagMapper tagMapper;

    public List<TagResponse> showAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(tagMapper::toTagResponse)
                .toList();
    }

    public List<TagResponse> showAllTagsInUniversity(Long universityId) {
        return tagRepository.findAllById(universityId)
                .stream()
                .map(tagMapper::toTagResponse)
                .toList();
    }
}
