package com.uniranking.app.domains.searching.tag;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/tags")
public class TagController {
    private final TagService tagService;

    @GetMapping(path = "/all")
    public ResponseEntity<List<TagResponse>> showAllTags() {
        return new ResponseEntity<>(tagService.showAllTags(), HttpStatus.OK);
    }

    @GetMapping(path = "/{universityId}")
    public ResponseEntity<List<TagResponse>> showAllTagsInUniversity(@PathVariable Long universityId) {
        return new ResponseEntity<>(tagService.showAllTagsInUniversity(universityId), HttpStatus.OK);
    }
}
