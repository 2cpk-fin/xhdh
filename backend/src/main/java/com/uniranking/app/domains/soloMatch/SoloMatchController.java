package com.uniranking.app.domains.soloMatch;

import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal; /* ref to authenticated user */

@RestController
@RequestMapping(path = "/api/duel/matches")
@RequiredArgsConstructor
public class SoloMatchController {

    private final SoloMatchService soloMatchService;

    private final UserRepository userRepository;

    @PostMapping(path = "/start")
    public ResponseEntity<MatchResponseDTO> startSoloMatch(Principal principal) {
        String userEmail = principal.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(soloMatchService.startNewDuel(user));
    }

    @PostMapping(path = "/choose")
    public ResponseEntity<SoloMatchReport> chooseSoloMatch(@Valid @RequestBody SoloMatchChoiceRequest choiceRequest,
            Principal principal) {
        String userEmail = principal.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SoloMatchReport report = soloMatchService.chooseSoloMatch(
                user.publicUserId,
                choiceRequest.matchUUID(),
                choiceRequest.universityUUID());

        return new ResponseEntity<>(report, HttpStatus.OK);
    }
}
