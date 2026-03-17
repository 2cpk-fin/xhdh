package com.xhdh.xhdh.controllers;

import com.xhdh.xhdh.dto.MatchRequest;
import com.xhdh.xhdh.dto.MatchResponse;
import com.xhdh.xhdh.services.MatchService;

import lombok.RequiredArgsConstructor;

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
        return matchService.getAllMatches();
    }

    @GetMapping(path = "/pending")
    public ResponseEntity<List<MatchResponse>> getPendingMatches() {
        return matchService.getAllPendingMatches();
    }

    @GetMapping(path = "/finished")
    public ResponseEntity<List<MatchResponse>> getFinishedMatches() {
        return matchService.getAllFinishedMatches();
    }

    @PostMapping
    public ResponseEntity<MatchResponse> createMatch(@RequestBody MatchRequest matchRequest) {
        return matchService.createMatch(matchRequest);
    }
}
