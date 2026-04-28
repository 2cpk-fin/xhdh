package com.uniranking.app.domains.scheduleMatch.leaderboard;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/schedule/match/leaderboard")
@RequiredArgsConstructor
public class ScheduleMatchLeaderboardController {
    private final ScheduleMatchLeaderboardService scheduleMatchLeaderboardService;

    @GetMapping(path = "/{publicMatchId}")
    public ResponseEntity<List<ScheduleParticipantResponse>> showLeaderboard(@PathVariable String publicMatchId) {
        return new ResponseEntity<>(scheduleMatchLeaderboardService.showLeaderboard(publicMatchId), HttpStatus.OK);
    }
}
