package com.xhdh.xhdh.controllers;

import com.xhdh.xhdh.dto.UniversityResponse;
import com.xhdh.xhdh.services.UniversityService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/universities")
@RequiredArgsConstructor
public class UniversityController {
    private final UniversityService universityService;

    @GetMapping
    public ResponseEntity<List<UniversityResponse>> getUniversityList(){
        return universityService.getUniversityList();
    }

    @GetMapping(path = "/name/{universityName}")
    public ResponseEntity<UniversityResponse> getUniversityByName(@PathVariable @RequestParam String universityName){
        return universityService.getUniversityByName(universityName);
    }

    @GetMapping(path = "/tags/{universityName}")
    public ResponseEntity<List<String>> showAllTagsInUniversity(@PathVariable String universityName){
        return universityService.showAllTagsInUniversity(universityName);
    }
}
