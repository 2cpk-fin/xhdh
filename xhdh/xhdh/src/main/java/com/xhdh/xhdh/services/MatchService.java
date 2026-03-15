package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.PendingMatchResponse;
import com.xhdh.xhdh.models.Match;
import com.xhdh.xhdh.dto.FinishedMatchResponse;
import com.xhdh.xhdh.dto.MatchResponse;
import com.xhdh.xhdh.repositories.MatchRepository;
import com.xhdh.xhdh.repositories.UniversityRepository;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;
    private final UniversityRepository universityRepository;

    public ResponseEntity<List<MatchResponse>> getAllMatches() {
        List<MatchResponse> matchResponses = new ArrayList<>();

        for (Match match : matchRepository.findAll()) {
            if (match.getStatus().equals("pending")) {
                matchResponses.add(new PendingMatchResponse(match));
            }
            else if (match.getStatus().equals("finished")) {
                matchResponses.add(new FinishedMatchResponse(match));
            }
        }
        return new ResponseEntity<>(matchResponses, HttpStatus.OK);
    }

    public ResponseEntity<List<PendingMatchResponse>> getAllPendingMatches() {
        List<PendingMatchResponse> pendingMatchResponses = new ArrayList<>();

        for (Match match : matchRepository.findAll()) {
            if (match.getStatus().equals("pending")) {
                pendingMatchResponses.add(new PendingMatchResponse(match));
            }
        }
        return new ResponseEntity<>(pendingMatchResponses, HttpStatus.OK);
    }

    public ResponseEntity<List<FinishedMatchResponse>> getAllFinishedMatches() {
        List<FinishedMatchResponse> finishedMatchResponses = new ArrayList<>();

        for (Match match : matchRepository.findAll()) {
            if (match.getStatus().equals("finished")) {
                finishedMatchResponses.add(new FinishedMatchResponse(match));
            }
        }
        return new ResponseEntity<>(finishedMatchResponses, HttpStatus.OK);
    }

}
