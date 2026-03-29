package com.xhdh.xhdh.presentation.controllers.matches;

import com.xhdh.xhdh.application.dto.matches.MatchParticipantResponse;
import com.xhdh.xhdh.application.dto.matches.MatchRequest;
import com.xhdh.xhdh.application.dto.matches.MatchResponse;
import com.xhdh.xhdh.application.dto.matches.MatchResponseDTO;
import com.xhdh.xhdh.application.dto.matches.SoloMatchChoiceRequest;
import com.xhdh.xhdh.application.dto.matches.SoloMatchReport;
import com.xhdh.xhdh.domain.models.User;
import com.xhdh.xhdh.infrastructure.repositories.*;
import com.xhdh.xhdh.application.services.MatchService;
import com.xhdh.xhdh.application.services.MatchmakingService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
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
        String userEmail = principal.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(matchmakingService.startNewDuel(user, false));
    }

    @PostMapping(path = "/solo/choose")
    public ResponseEntity<SoloMatchReport> chooseSoloMatch(@RequestBody SoloMatchChoiceRequest choiceRequest, Principal principal) {
        String userEmail = principal.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SoloMatchReport report = matchService.chooseSoloMatch(
                user.getUserUUID(),
                choiceRequest.matchUUID(),
                choiceRequest.universityUUID()
        );

        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMatches() {
        return new ResponseEntity<>(matchService.getAllMatches(), HttpStatus.OK);
    }

    @GetMapping(path = "/all/not-started")
    public ResponseEntity<List<MatchResponse>> getMatchesNotStarted() {
        return new ResponseEntity<>(matchService.getAllNotStartedMatches(), HttpStatus.OK);
    }

    @GetMapping(path = "/all/pending")
    public ResponseEntity<List<MatchResponse>> getPendingMatches() {
        return new ResponseEntity<>(matchService.getAllPendingMatches(), HttpStatus.OK);
    }

    @GetMapping(path = "/all/finished")
    public ResponseEntity<List<MatchResponse>> getFinishedMatches() {
        return new ResponseEntity<>(matchService.getAllFinishedMatches(), HttpStatus.OK);
    }

    @GetMapping(path = "/participants/id/{id}")
    public ResponseEntity<List<MatchParticipantResponse>> getMatchParticipant(@PathVariable long id) {
        return new ResponseEntity<>(matchService.getAllParticipants(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<MatchResponse> createMatch(@RequestBody MatchRequest matchRequest) {
        return new ResponseEntity<>(matchService.createMatch(matchRequest), HttpStatus.CREATED);
    }

    @PutMapping(path = "/id/{id}")
    public ResponseEntity<MatchResponse> updateMatch(@PathVariable long id, @RequestBody MatchRequest matchRequest) {
        return new ResponseEntity<>(matchService.updateMatchById(id, matchRequest), HttpStatus.OK);
    }

    @DeleteMapping(path = "id/{id}")
    public ResponseEntity<String> deleteMatchById(@PathVariable long id) {
        return new ResponseEntity<>(matchService.deleteMatchById(id), HttpStatus.OK);
    }
}
