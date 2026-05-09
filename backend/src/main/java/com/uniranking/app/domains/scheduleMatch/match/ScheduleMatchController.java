package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/schedule/match")
@RequiredArgsConstructor
public class ScheduleMatchController {
    private final ScheduleMatchService scheduleMatchService;

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

    @PatchMapping(path = "/votes")
    public ResponseEntity<?> vote(
            @RequestParam String publicMatchId,
            @RequestParam Long universityId,
            Authentication authentication) {
        // Validate the user first
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be logged in to vote");
        }

        try {
            scheduleMatchService.vote(universityId, publicMatchId, authentication);
            // Return 200 OK if vote success
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e) {
            // This catches "Already voted" or "Match not started" errors
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Secret route (for admin only)
    @PostMapping(path = "/admin/create")
    public ResponseEntity<?> createScheduledMatch(@Valid @RequestBody ScheduleMatchRequest scheduleMatchRequest) {
        try {
            ScheduleMatchResponse response = scheduleMatchService.createMatch(scheduleMatchRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Secret route(for admin only)
    @PatchMapping(path = "/admin/update/{id}")
    public ResponseEntity<?> updateScheduledMatch(
            @PathVariable long id,
            @Valid @RequestBody ScheduleMatchRequest scheduleMatchRequest) {
        try {
            ScheduleMatchResponse response = scheduleMatchService.updateMatchById(id, scheduleMatchRequest);
            return ResponseEntity.ok(response);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Secret route (for admin only)
    @DeleteMapping(path = "/admin/delete/{id}")
    public ResponseEntity<String> deleteScheduledMatch(@PathVariable long id) {
        try {
            String message = scheduleMatchService.deleteMatchById(id);
            return ResponseEntity.ok().body(message);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
