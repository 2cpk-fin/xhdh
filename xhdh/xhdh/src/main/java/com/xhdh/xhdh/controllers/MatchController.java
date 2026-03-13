package com.xhdh.xhdh.controllers;

import com.xhdh.xhdh.dto.FinishedMatchResponse;
import com.xhdh.xhdh.dto.MatchResponse;
import com.xhdh.xhdh.dto.PendingMatchResponse;
import com.xhdh.xhdh.services.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<PendingMatchResponse>> getPendingMatches() {
        return matchService.getAllPendingMatches();
    }

    @GetMapping(path = "/finished")
    public ResponseEntity<List<FinishedMatchResponse>> getFinishedMatches() {
        return matchService.getAllFinishedMatches();
    }
}
