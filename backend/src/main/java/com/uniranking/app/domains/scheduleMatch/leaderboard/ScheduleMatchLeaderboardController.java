package com.uniranking.app.domains.scheduleMatch.leaderboard;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/events/match/leaderboard")
@RequiredArgsConstructor
public class ScheduleMatchLeaderboardController {
    private final ScheduleMatchLeaderboardService scheduleMatchLeaderboardService;

    @GetMapping(path = "/{id}")
    public ResponseEntity<List<ScheduleParticipantResponse>> showLeaderboard(@RequestParam @PathVariable String id) {
        return new ResponseEntity<>(scheduleMatchLeaderboardService.showLeaderboard(id), HttpStatus.OK);
    }
}
