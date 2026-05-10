package com.uniranking.app.domains.soloMatch;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// TODO: Write test for solo match
@RestController
@RequestMapping(path = "/api/solo/matches")
@RequiredArgsConstructor
public class SoloMatchController {

    private final SoloMatchService soloMatchServiceImpl;

    @PostMapping(path = "/choose")
    public ResponseEntity<SoloMatchReport> chooseWinner(
            @RequestParam("winnerId") Long winnerId,
            @RequestParam("loserId") Long loserId) {
        return ResponseEntity.ok(soloMatchServiceImpl.chooseWinner(winnerId, loserId));
    }

}