package com.xhdh.xhdh.controllers;

import com.xhdh.xhdh.dto.MatchRequest;
import com.xhdh.xhdh.dto.MatchResponse;
import com.xhdh.xhdh.services.MatchService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/matches")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;

    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMatches() {
        return new ResponseEntity<>(matchService.getAllMatches(), HttpStatus.OK);
    }

    @GetMapping(path = "/pending")
    public ResponseEntity<List<MatchResponse>> getPendingMatches() {
        return new ResponseEntity<>(matchService.getAllPendingMatches(), HttpStatus.OK);
    }

    @GetMapping(path = "/finished")
    public ResponseEntity<List<MatchResponse>> getFinishedMatches() {
        return new ResponseEntity<>(matchService.getAllFinishedMatches(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<MatchResponse> createMatch(@RequestBody MatchRequest matchRequest) {
        return new ResponseEntity<>(matchService.createMatch(matchRequest), HttpStatus.CREATED);
    }
}
