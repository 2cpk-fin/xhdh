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
@RequestMapping(path = "/universities")
@RequiredArgsConstructor
public class UniversityController {
    private final UniversityService universityService;

    @Operation(summary = "Get list of universities")
    @Parameters({
            @Parameter(name = "page", description = "Page number", example = "0"),
            @Parameter(name = "size", description = "Items per page", example = "15"),
            @Parameter(name = "sort", description = "Sorting criteria", example = "elo,desc")
    })
    @GetMapping
    public ResponseEntity<Page<UniversityResponse>> getUniversityList(
            @Parameter(hidden = true) Pageable pageable) {
        return new ResponseEntity<>(universityService.getUniversityList(pageable), HttpStatus.OK);
    }

    @GetMapping(path = "/name/{universityName}")
    public ResponseEntity<UniversityResponse> getUniversityByName(@PathVariable String universityName) {
        return new ResponseEntity<>(universityService.getUniversityByName(universityName), HttpStatus.OK);
    }

    @GetMapping(path = "/tags/{universityName}")
    public ResponseEntity<List<String>> showAllTagsInUniversity(@PathVariable String universityName) {
        return new ResponseEntity<>(universityService.showAllTagsInUniversity(universityName), HttpStatus.OK);
    }
}
