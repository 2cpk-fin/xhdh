package com.xhdh.xhdh.presentation.controllers.matches;

import com.xhdh.xhdh.application.services.LeaderboardService;
import com.xhdh.xhdh.domain.models.Participant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<List<Participant>> showLeaderboard() {
        return new ResponseEntity<>(leaderboardService.showLeaderboard(), HttpStatus.OK);
    }
}
