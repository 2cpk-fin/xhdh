package com.uniranking.app.domains.soloMatch;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "/api/solo/matches")
@RequiredArgsConstructor
public class SoloMatchController {

    private final SoloMatchService soloMatchServiceImpl;

    @PostMapping(path = "/start")
    public ResponseEntity<SoloMatchResponse> startSoloMatch() {
        return ResponseEntity.ok(soloMatchServiceImpl.startNewDuel());
    }

    @PostMapping(path = "/choose")
    public ResponseEntity<SoloMatchReport> chooseWinner(
            @RequestParam UUID publicMatchId,
            @RequestParam Long winnerId) {
        return ResponseEntity.ok(soloMatchServiceImpl.chooseWinner(publicMatchId, winnerId));
    }
}