package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.MatchParticipantResponse;
import com.xhdh.xhdh.dto.MatchRequest;
import com.xhdh.xhdh.models.Match;
import com.xhdh.xhdh.dto.MatchResponse;
import com.xhdh.xhdh.models.MatchParticipant;
import com.xhdh.xhdh.models.Status;
import com.xhdh.xhdh.repositories.MatchParticipantRepository;
import com.xhdh.xhdh.repositories.MatchRepository;
import com.xhdh.xhdh.repositories.UniversityRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;

    private final MatchParticipantRepository matchParticipantRepository;

    private final UniversityRepository universityRepository;

    private MatchResponse buildMatchResponse(Match match) {
        return MatchResponse.builder()
                .title(match.getTitle())
                .status(String.valueOf(match.getStatus()))
                .participants(buildParticipantResponses(match))
                .startTime(match.getStartTime())
                .endTime(match.getEndTime())
                .build();
    }

    private List<MatchParticipantResponse> buildParticipantResponses(Match match) {
        return match.getParticipants()
                .stream()
                .map(MatchParticipantResponse::new)
                .collect(Collectors.toList());
    }

    public List<MatchResponse> getAllMatches() {
        return matchRepository.findAll()
                .stream()
                .map(this::buildMatchResponse)
                .collect(Collectors.toList());
    }

    public List<MatchResponse> getAllPendingMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "PENDING".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .collect(Collectors.toList());
    }

    public List<MatchResponse> getAllFinishedMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "FINISHED".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .collect(Collectors.toList());
    }

    public MatchResponse createMatch(MatchRequest matchRequest) {
        // Since Participants need Match to exist, but Match need to have Participants first
        // Hence, we will build the Match first
        Match newMatch = Match.builder()
                .title(matchRequest.getTitle())
                .status(Status.NOT_STARTED)
                .startTime(matchRequest.getStartTime())
                .endTime(matchRequest.getEndTime())
                .build();

        // Then, we will build the Participant
        List<MatchParticipant> participants = matchRequest.getParticipants()
                .stream()
                .map(universityName -> {
                    MatchParticipant participant = new MatchParticipant();
                    participant.setMatch(newMatch);
                    participant.setUniversity(universityRepository.findByName(universityName));
                    return participant;
                })
                .collect(Collectors.toList());

        // And set to Match
        newMatch.setParticipants(participants);

        return buildMatchResponse(matchRepository.save(newMatch));
    }
}
