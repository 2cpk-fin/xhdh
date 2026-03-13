package com.xhdh.xhdh.controllers;

import com.xhdh.xhdh.dto.TagResponse;
import com.xhdh.xhdh.services.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/tags")
public class TagController {
    private final TagService tagService;

    @GetMapping
    public List<ResponseEntity<TagResponse>> getAllTags() {
        return tagService.showAllTags();
    }
}
