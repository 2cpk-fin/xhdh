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
            @Parameter(name = "tagIds", description = "List of Tag IDs to filter by", example = "1,2")
    })
    @GetMapping
    public ResponseEntity<Page<UniversityResponse>> getUniversities(
            @Parameter(hidden = true) Pageable pageable,
            @RequestParam(required = false) String input,
            @RequestParam(required = false) List<Long> tagIds) {
        Page<UniversityResponse> results = universityService.getUniversityListByInput(pageable, input, tagIds);

        return ResponseEntity.ok(results);
    }

    @PostMapping(path = "/admin/create")
    public ResponseEntity<UniversityResponse> createUniversity(@RequestBody UniversityRequest universityRequest) {
        return ResponseEntity.ok(universityService.createUniversity(universityRequest));
    }

    @PatchMapping(path = "/admin/update/{id}")
    public ResponseEntity<?> updateUniversity(
            @PathVariable Long id,
            @RequestBody UniversityRequest universityRequest
    ) {
        try {
            return ResponseEntity.ok(universityService.updateUniversityById(id, universityRequest));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping(path = "/admin/delete/{id}")
    public ResponseEntity<String> deleteUniversity(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(universityService.deleteUniversityById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
