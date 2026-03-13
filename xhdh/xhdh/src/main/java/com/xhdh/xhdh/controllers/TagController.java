package com.xhdh.xhdh.controllers;

import com.xhdh.xhdh.dto.TagResponse;
import com.xhdh.xhdh.services.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/tags")
public class TagController {
    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags() {
        return tagService.showAllTags();
    }

    @GetMapping(path = "/{universityName}")
    public ResponseEntity<List<TagResponse>> getAllTagsInUniversity(@PathVariable @RequestParam String universityName) {
        return tagService.showAllTagsInUniversity(universityName);
    }
}
