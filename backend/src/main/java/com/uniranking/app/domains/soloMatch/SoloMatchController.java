package com.uniranking.app.domains.soloMatch;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> chooseWinner(@RequestParam UUID publicMatchId, @RequestParam Long winnerId) {
        try {
            SoloMatchReport report = soloMatchService.chooseWinner(publicMatchId, winnerId);
            return ResponseEntity.ok(report);
        }
        catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.GONE).body(e.getMessage());
        }
    }
}
