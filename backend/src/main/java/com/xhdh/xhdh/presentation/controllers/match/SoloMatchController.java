package com.xhdh.xhdh.presentation.controllers.match;

import com.xhdh.xhdh.application.dto.match.MatchResponseDTO;
import com.xhdh.xhdh.application.dto.match.SoloMatchChoiceRequest;
import com.xhdh.xhdh.application.dto.match.SoloMatchReport;
import com.xhdh.xhdh.domain.models.authentication.User;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UserRepository;
import com.xhdh.xhdh.application.services.SoloMatchService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal; /* ref to authenticated user */

@RestController
@RequestMapping(path = "/api/matches")
@RequiredArgsConstructor
public class SoloMatchController {

    private final SoloMatchService soloMatchService;

    private final UserRepository userRepository;
    
    @PostMapping(path = "/solo/start")
    public ResponseEntity<MatchResponseDTO> startSoloMatch(Principal principal) {
        String userEmail = principal.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(soloMatchService.startNewDuel(user));
    }

    @PostMapping(path = "/solo/choose")
    public ResponseEntity<SoloMatchReport> chooseSoloMatch(@Valid @RequestBody SoloMatchChoiceRequest choiceRequest, Principal principal) {
        String userEmail = principal.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SoloMatchReport report = soloMatchService.chooseSoloMatch(
                user.getUserUUID(),
                choiceRequest.matchUUID(),
                choiceRequest.universityUUID()
        );

        return new ResponseEntity<>(report, HttpStatus.OK);
    }
}
