package com.uniranking.app.domains.searching.university;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/universities")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityService universityService;

    @Operation(summary = "Get universities with optional search and tag filters")
    @Parameters({
            @Parameter(name = "page", description = "Page number", example = "0"),
            @Parameter(name = "size", description = "Items per page", example = "15"),
            @Parameter(name = "sort", description = "Sorting criteria", example = "elo,desc"),
            @Parameter(name = "input", description = "Search by name or abbreviation", example = "Hanoi"),
            @Parameter(name = "tags", description = "List of Tag Enums to filter by", example = "TECHNOLOGY,ENGINEERING")
    })
    @GetMapping
    public ResponseEntity<Page<UniversityResponse>> getUniversities(
            @Parameter(hidden = true) Pageable pageable,
            @RequestParam(required = false) String input,
            @RequestParam(required = false) List<Tag> tags) {

        return ResponseEntity.ok(universityService.getUniversityListByInput(pageable, input, tags));
    }

    @PostMapping(path = "/admin/create")
    public ResponseEntity<UniversityResponse> createUniversity(
            @RequestBody UniversityRequest universityRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(universityService.createUniversity(universityRequest));
    }

    @PatchMapping(path = "/admin/update/{id}")
    public ResponseEntity<UniversityResponse> updateUniversity(
            @PathVariable Long id,
            @RequestBody UniversityRequest universityRequest) {
        return ResponseEntity.ok(universityService.updateUniversityById(id, universityRequest));
    }

    @DeleteMapping(path = "/admin/delete/{id}")
    public ResponseEntity<String> deleteUniversity(@PathVariable Long id) {
        return ResponseEntity.ok(universityService.deleteUniversityById(id));
    }
}