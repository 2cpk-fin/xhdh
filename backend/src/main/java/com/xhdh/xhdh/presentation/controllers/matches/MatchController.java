package com.xhdh.xhdh.presentation.controllers.matches;

import com.xhdh.xhdh.application.dto.matches.MatchParticipantResponse;
import com.xhdh.xhdh.application.dto.matches.MatchRequest;
import com.xhdh.xhdh.application.dto.matches.MatchResponse;
import com.xhdh.xhdh.application.dto.matches.MatchResponseDTO;
import com.xhdh.xhdh.application.dto.matches.SoloMatchChoiceRequest;
import com.xhdh.xhdh.application.dto.matches.SoloMatchReport;
import com.xhdh.xhdh.domain.models.User;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UserRepository;
import com.xhdh.xhdh.application.services.ScheduleMatchService;
import com.xhdh.xhdh.application.services.SoloMatchService;

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

    private final ScheduleMatchService scheduleMatchService;

    private final SoloMatchService soloMatchService;

    private final UserRepository userRepository;
    
    @PostMapping(path = "/solo/start")
    public ResponseEntity<MatchResponseDTO> startSoloMatch(Principal principal) {
        String userEmail = principal.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(soloMatchService.startNewDuel(user));
    }

    @PostMapping(path = "/solo/choose")
    public ResponseEntity<SoloMatchReport> chooseSoloMatch(@RequestBody SoloMatchChoiceRequest choiceRequest, Principal principal) {
        String userEmail = principal.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SoloMatchReport report = soloMatchService.chooseSoloMatch(
                user.getUserUUID(),
                choiceRequest.matchUUID(),
                choiceRequest.universityUUID()
        );

        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<MatchResponse>> getAllScheduledMatches() {
        return new ResponseEntity<>(scheduleMatchService.getAllMatches(), HttpStatus.OK);
    }

    @GetMapping(path = "/all/not-started")
    public ResponseEntity<List<MatchResponse>> getScheduledMatchesNotStarted() {
        return new ResponseEntity<>(scheduleMatchService.getAllNotStartedMatches(), HttpStatus.OK);
    }

    @GetMapping(path = "/all/pending")
    public ResponseEntity<List<MatchResponse>> getScheduledPendingMatches() {
        return new ResponseEntity<>(scheduleMatchService.getAllPendingMatches(), HttpStatus.OK);
    }

    @GetMapping(path = "/all/finished")
    public ResponseEntity<List<MatchResponse>> getScheduledFinishedMatches() {
        return new ResponseEntity<>(scheduleMatchService.getAllFinishedMatches(), HttpStatus.OK);
    }

    @GetMapping(path = "/participants/id/{id}")
    public ResponseEntity<List<MatchParticipantResponse>> getScheduledMatchParticipant(@PathVariable long id) {
        return new ResponseEntity<>(scheduleMatchService.getAllParticipants(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<MatchResponse> createScheduledMatch(@RequestBody MatchRequest matchRequest) {
        return new ResponseEntity<>(scheduleMatchService.createMatch(matchRequest), HttpStatus.CREATED);
    }

    @PutMapping(path = "/id/{id}")
    public ResponseEntity<MatchResponse> updateScheduledMatch(@PathVariable long id, @RequestBody MatchRequest matchRequest) {
        return new ResponseEntity<>(scheduleMatchService.updateMatchById(id, matchRequest), HttpStatus.OK);
    }

    @DeleteMapping(path = "id/{id}")
    public ResponseEntity<String> deleteScheduledMatch(@PathVariable long id) {
        return new ResponseEntity<>(scheduleMatchService.deleteMatchById(id), HttpStatus.OK);
    }
}
