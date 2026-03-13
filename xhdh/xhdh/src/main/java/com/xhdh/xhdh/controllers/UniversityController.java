package com.xhdh.xhdh.controllers;

import com.xhdh.xhdh.dto.UniversityResponse;
import com.xhdh.xhdh.services.UniversityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/universities")
@RequiredArgsConstructor
public class UniversityController {
    private final UniversityService universityService;

    @GetMapping
    public List<ResponseEntity<UniversityResponse>> findAll(){
        return universityService.getUniversityList();
    }

    @GetMapping(path = "/{name}")
    public ResponseEntity<UniversityResponse> findUniversityByName(@RequestParam String name){
        return universityService.getUniversityByName(name);
    }

    @GetMapping(path = "/{abbreviation}")
    public ResponseEntity<UniversityResponse> findUniversityByAbbreviation(@RequestParam String abbreviation){
        return universityService.getUniversityByAbbreviation(abbreviation);
    }
}
