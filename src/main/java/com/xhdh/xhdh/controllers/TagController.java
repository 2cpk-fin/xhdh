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
    public ResponseEntity<List<TagResponse>> showAllTags() {
        return tagService.showAllTags();
    }

    @GetMapping(path = "/universities/{tagName}")
    public ResponseEntity<List<String>> showTagByName(@PathVariable @RequestParam String tagName) {
        return tagService.showAllUniversitiesByTagName(tagName);
    }
}
