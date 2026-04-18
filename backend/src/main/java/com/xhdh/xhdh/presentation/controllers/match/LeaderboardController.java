package com.xhdh.xhdh.presentation.controllers.match;

import com.xhdh.xhdh.application.dto.match.ParticipantResponse;
import com.xhdh.xhdh.application.services.EventLeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    private final EventLeaderboardService eventLeaderboardService;

    @GetMapping(path = "/{id}")
    public ResponseEntity<List<ParticipantResponse>> showLeaderboard(@RequestParam @PathVariable String id) {
        return new ResponseEntity<>(eventLeaderboardService.showLeaderboard(id), HttpStatus.OK);
    }
}
