package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.MatchParticipantResponse;
import com.xhdh.xhdh.models.Match;
import com.xhdh.xhdh.dto.MatchResponse;
import com.xhdh.xhdh.models.MatchParticipant;
import com.xhdh.xhdh.repositories.MatchParticipantRepository;
import com.xhdh.xhdh.repositories.MatchRepository;
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

    private final MatchParticipantRepository matchParticipantRepository;

    private MatchResponse buildMatchResponse(Match match) {
        MatchResponse matchResponse;
        matchResponse = MatchResponse.builder()
                .title(match.getTitle())
                .status(match.getStatus())
                .participants(buildParticipants(match))
                .startTime(match.getStartTime())
                .endTime(match.getEndTime())
                .build();
        return matchResponse;
    }

    private List<MatchParticipantResponse> buildParticipants(Match match) {
        List<MatchParticipantResponse> participantsResponse = new ArrayList<>();
        for (MatchParticipant participant : match.getParticipants()) {
            participantsResponse.add(new MatchParticipantResponse(participant));
        }
        return participantsResponse;
    }

    public ResponseEntity<List<MatchResponse>> getAllMatches() {
        List<MatchResponse> matchResponses = new ArrayList<>();
        for (Match match : matchRepository.findAll()) {
            MatchResponse matchResponse = buildMatchResponse(match);
            matchResponses.add(matchResponse);
        }
        return new ResponseEntity<>(matchResponses, HttpStatus.OK);
    }

    public ResponseEntity<List<MatchResponse>> getAllPendingMatches() {
        List<MatchResponse> pendingMatchResponses = new ArrayList<>();
        for (Match match : matchRepository.findAll()) {
            if (match.getStatus().equals("pending")) {
                MatchResponse matchResponse = buildMatchResponse(match);
                pendingMatchResponses.add(matchResponse);
            }
        }
        return new ResponseEntity<>(pendingMatchResponses, HttpStatus.OK);
    }

    public ResponseEntity<List<MatchResponse>> getAllFinishedMatches() {
        List<MatchResponse> finishedMatchResponses = new ArrayList<>();
        for (Match match : matchRepository.findAll()) {
            if (match.getStatus().equals("finished")) {
                MatchResponse matchResponse = buildMatchResponse(match);
                finishedMatchResponses.add(matchResponse);
            }
        }
        return new ResponseEntity<>(finishedMatchResponses, HttpStatus.OK);
    }
}
