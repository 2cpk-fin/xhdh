package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
        return ResponseEntity.ok(scheduleMatchService.getAllNotStartedMatches());
    }

    // Current matches
    @GetMapping(path = "/all/pending")
    public ResponseEntity<List<ScheduleMatchResponse>> getScheduledPendingMatches() {
        return ResponseEntity.ok(scheduleMatchService.getAllPendingMatches());
    }

    // History check (7 days)
    @GetMapping(path = "/all/finished")
    public ResponseEntity<List<ScheduleMatchResponse>> getScheduledFinishedMatches() {
        return ResponseEntity.ok(scheduleMatchService.getAllFinishedMatches());
    }

    // Get all the participants
    @GetMapping(path = "/{matchId}/participants")
    public ResponseEntity<List<ScheduleParticipantResponse>> getScheduledMatchParticipant(@PathVariable long matchId) {
        return ResponseEntity.ok(scheduleMatchService.getAllParticipants(matchId));
    }

    @PatchMapping(path = "/votes")
    public ResponseEntity<Void> vote(
            @RequestParam String publicMatchId,
            @RequestParam Long universityId,
            Authentication authentication) {

        scheduleMatchService.vote(universityId, publicMatchId, authentication);
        return ResponseEntity.ok().build();
    }

    // Secret route (for admin only)
    @GetMapping(path = "/admin/get")
    public ResponseEntity<Page<ScheduleMatchResponse>> getAllMatches(
            @RequestParam int pageNo,
            @RequestParam int size) {
        return ResponseEntity.ok(scheduleMatchService.getAllMatches(pageNo, size));
    }

    @PostMapping(path = "/admin/create")
    public ResponseEntity<ScheduleMatchResponse> createScheduledMatch(
            @Valid @RequestBody ScheduleMatchRequest scheduleMatchRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(scheduleMatchService.createMatch(scheduleMatchRequest));
    }

    // Secret route(for admin only)
    @PatchMapping(path = "/admin/update/{id}")
    public ResponseEntity<ScheduleMatchResponse> updateScheduledMatch(
            @PathVariable long id,
            @Valid @RequestBody ScheduleMatchRequest scheduleMatchRequest) {
        return ResponseEntity.ok(scheduleMatchService.updateMatchById(id, scheduleMatchRequest));
    }

    // Secret route (for admin only)
    @DeleteMapping(path = "/admin/delete/{id}")
    public ResponseEntity<String> deleteScheduledMatch(@PathVariable long id) {
        return ResponseEntity.ok(scheduleMatchService.deleteMatchById(id));
    }
}