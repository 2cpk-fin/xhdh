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
    public ResponseEntity<List<UniversityResponse>> findAll(){
        return universityService.getUniversityList();
    }

    @GetMapping(path = "/{name}")
    public ResponseEntity<UniversityResponse> findUniversityByName(@PathVariable @RequestParam String name){
        return universityService.getUniversityByName(name);
    }

    @GetMapping(path = "/{abbreviation}")
    public ResponseEntity<UniversityResponse> findUniversityByAbbreviation(@PathVariable @RequestParam String abbreviation){
        return universityService.getUniversityByAbbreviation(abbreviation);
    }

    @GetMapping(path = "/{tagName}")
    public ResponseEntity<List<UniversityResponse>> findUniversityByTagName(@PathVariable @RequestParam String tagName){
        return universityService.getAllUniversitiesByTag(tagName);
    }
}
