package com.xhdh.xhdh.controllers;

import com.xhdh.xhdh.dto.MatchParticipantResponse;
import com.xhdh.xhdh.dto.MatchResponse;
import com.xhdh.xhdh.models.User;
import com.xhdh.xhdh.repositories.UserRepository;
import com.xhdh.xhdh.services.MatchService;
import com.xhdh.xhdh.services.MatchmakingService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(path = "/api/matches")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;
    private final UserRepository userRepository;
    private final MatchmakingService matchmakingService;
    
    @PostMapping(path = "/start")
    public ResponseEntity<MatchParticipantResponse> startMatch(Principal principal){
        String userEmail = principal.getName(); 
        User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        
    return ResponseEntity.ok(matchmakingService.startNewDuel(user,false));
    }

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
}
