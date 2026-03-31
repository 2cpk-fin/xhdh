package com.xhdh.xhdh.presentation.controllers.matches;

import com.xhdh.xhdh.application.services.LeaderboardService;
import com.xhdh.xhdh.domain.models.Participant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    @GetMapping(path = "/{id}")
    public ResponseEntity<List<Participant>> showLeaderboard(@RequestParam @PathVariable String id) {
        return new ResponseEntity<>(leaderboardService.showLeaderboard(id), HttpStatus.OK);
    }
}
