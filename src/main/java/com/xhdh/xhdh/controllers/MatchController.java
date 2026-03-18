package com.xhdh.xhdh.controllers;

import com.xhdh.xhdh.dto.MatchResponse;
import com.xhdh.xhdh.dto.MatchResponseDTO;
import com.xhdh.xhdh.models.User;
import com.xhdh.xhdh.repositories.UserRepository;
import com.xhdh.xhdh.services.MatchService;
import com.xhdh.xhdh.services.MatchmakingService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal; /* ref to authenticated user */
import java.util.List;

@RestController
@RequestMapping(path = "/api/matches")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;
    private final UserRepository userRepository;
    private final MatchmakingService matchmakingService;
    
    @PostMapping(path = "/solo/start")
    public ResponseEntity<MatchResponseDTO> startMatch(Principal principal) {
    // If testing via Swagger/PermitAll, principal will be null
    if (principal == null) {
        // Just for development: pick a random user so the logic doesn't break
        User devUser = userRepository.findAll().get(0);
        return ResponseEntity.ok(matchmakingService.startNewDuel(devUser, false));
    }
    String userEmail = principal.getName();
    User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
    return ResponseEntity.ok(matchmakingService.startNewDuel(user, false));
}
    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMatches() {
        return matchService.getAllMatches();
    }

    @GetMapping(path = "/all/pending")
    public ResponseEntity<List<MatchResponse>> getPendingMatches() {
        return matchService.getAllPendingMatches();
    }

    @GetMapping(path = "/all/finished")
    public ResponseEntity<List<MatchResponse>> getFinishedMatches() {
        return matchService.getAllFinishedMatches();
    }
}
