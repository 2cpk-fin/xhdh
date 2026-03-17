package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.MatchParticipantResponse;
import com.xhdh.xhdh.dto.MatchRequest;
import com.xhdh.xhdh.dto.UniversityRequest;
import com.xhdh.xhdh.models.Match;
import com.xhdh.xhdh.dto.MatchResponse;
import com.xhdh.xhdh.models.MatchParticipant;
import com.xhdh.xhdh.models.Status;
import com.xhdh.xhdh.models.University;
import com.xhdh.xhdh.repositories.MatchParticipantRepository;
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

    private final MatchParticipantRepository matchParticipantRepository;

    private final UniversityRepository universityRepository;

    private MatchResponse buildMatchResponse(Match match) {
        MatchResponse matchResponse;
        matchResponse = MatchResponse.builder()
                .matchTitle(match.getTitle())
                .status(String.valueOf(match.getStatus()))
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
            if (String.valueOf(match.getStatus()).equals("PENDING")) {
                MatchResponse matchResponse = buildMatchResponse(match);
                pendingMatchResponses.add(matchResponse);
            }
        }
        return new ResponseEntity<>(pendingMatchResponses, HttpStatus.OK);
    }

    public ResponseEntity<List<MatchResponse>> getAllFinishedMatches() {
        List<MatchResponse> finishedMatchResponses = new ArrayList<>();
        for (Match match : matchRepository.findAll()) {
            if (String.valueOf(match.getStatus()).equals("PENDING")) {
                MatchResponse matchResponse = buildMatchResponse(match);
                finishedMatchResponses.add(matchResponse);
            }
        }
        return new ResponseEntity<>(finishedMatchResponses, HttpStatus.OK);
    }

    public ResponseEntity<MatchResponse> createMatch(MatchRequest matchRequest) {
        Match newMatch = new Match();
        List<MatchParticipant> participants = new ArrayList<>();
        for (UniversityRequest universityRequest : matchRequest.getParticipants()) {
            MatchParticipant participant = new MatchParticipant();
            participant.setTotalVotes(0);
            participant.setRank(1);
            participant.setMatch(newMatch);
            University university = universityRepository.findByName(universityRequest.getName());
            participant.setUniversity(university);
        }
        newMatch.setTitle(matchRequest.getTitle());
        newMatch.setStatus(Status.valueOf("NOT_STARTED"));
        newMatch.setStartTime(matchRequest.getStartTime());
        newMatch.setEndTime(matchRequest.getEndTime());
        newMatch.setVotes(new ArrayList<>());
        newMatch.setParticipants(participants);
        MatchResponse matchResponse = buildMatchResponse(matchRepository.save(newMatch));
        return new ResponseEntity<>(matchResponse, HttpStatus.CREATED);
    }
}
