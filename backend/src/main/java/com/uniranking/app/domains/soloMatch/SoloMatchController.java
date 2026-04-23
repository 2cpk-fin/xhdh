package com.uniranking.app.domains.soloMatch;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "/api/solo/matches")
@RequiredArgsConstructor
public class SoloMatchController {

    private final SoloMatchService soloMatchService;

    @PostMapping(path = "/start")
    public ResponseEntity<SoloMatchResponse> startSoloMatch() {
        return ResponseEntity.ok(soloMatchService.startNewDuel());
    }

    @PostMapping(path = "/choose")
    public ResponseEntity<SoloMatchReport> chooseSoloMatch(@RequestParam UUID matchUUID, @RequestParam Long winnerId) {
        SoloMatchReport report = soloMatchService.chooseSoloMatch(matchUUID, winnerId);
        return ResponseEntity.ok(report);
    }
}
