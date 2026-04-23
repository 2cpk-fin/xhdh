package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/schedule/match")
@RequiredArgsConstructor
public class ScheduleMatchController {
    private final ScheduleMatchService scheduleMatchService;

    @GetMapping(path = "/all")
    public ResponseEntity<List<ScheduleMatchResponse>> getAllScheduledMatches() {
        return new ResponseEntity<>(scheduleMatchService.getAllMatches(), HttpStatus.OK);
    }

    // Upcoming matches
    @GetMapping(path = "/all/not-started")
    public ResponseEntity<List<ScheduleMatchResponse>> getScheduledMatchesNotStarted() {
        return new ResponseEntity<>(scheduleMatchService.getAllNotStartedMatches(), HttpStatus.OK);
    }

    // Current matches
    @GetMapping(path = "/all/pending")
    public ResponseEntity<List<ScheduleMatchResponse>> getScheduledPendingMatches() {
        return new ResponseEntity<>(scheduleMatchService.getAllPendingMatches(), HttpStatus.OK);
    }

    // History check (7 days)
    @GetMapping(path = "/all/finished")
    public ResponseEntity<List<ScheduleMatchResponse>> getScheduledFinishedMatches() {
        return new ResponseEntity<>(scheduleMatchService.getAllFinishedMatches(), HttpStatus.OK);
    }

    // Get all the participants
    @GetMapping(path = "/{matchId}/participants")
    public ResponseEntity<List<ScheduleParticipantResponse>> getScheduledMatchParticipant(@PathVariable long matchId) {
        return new ResponseEntity<>(scheduleMatchService.getAllParticipants(matchId), HttpStatus.OK);
    }

    // Secret route (for admin only)
    @PostMapping
    public ResponseEntity<ScheduleMatchResponse> createScheduledMatch(
            @Valid @RequestBody ScheduleMatchRequest scheduleMatchRequest) {
        return new ResponseEntity<>(scheduleMatchService.createMatch(scheduleMatchRequest), HttpStatus.CREATED);
    }

    // Secret route(for admin only)
    @PutMapping(path = "/{id}")
    public ResponseEntity<ScheduleMatchResponse> updateScheduledMatch(
            @PathVariable long id,
            @Valid @RequestBody ScheduleMatchRequest scheduleMatchRequest) {
        return new ResponseEntity<>(scheduleMatchService.updateMatchById(id, scheduleMatchRequest), HttpStatus.OK);
    }

    @PatchMapping(path = "/votes/{matchId}")
    public void vote(
            @PathVariable String matchId,
            @RequestParam String universityName) {
        scheduleMatchService.vote(universityName, matchId);
    }

    // Secret route (for admin only)
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<String> deleteScheduledMatch(@PathVariable long id) {
        return new ResponseEntity<>(scheduleMatchService.deleteMatchById(id), HttpStatus.OK);
    }
}
