package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.application.dto.matches.MatchParticipantResponse;
import com.xhdh.xhdh.application.dto.matches.MatchRequest;
import com.xhdh.xhdh.application.dto.matches.MatchResponse;
import com.xhdh.xhdh.domain.models.Match;
import com.xhdh.xhdh.domain.models.MatchParticipant;
import com.xhdh.xhdh.domain.models.Status;
import com.xhdh.xhdh.domain.models.University;
import com.xhdh.xhdh.infrastructure.repositories.jpa.MatchRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UniversityRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleMatchService {
    private final MatchRepository matchRepository;

    private final UniversityRepository universityRepository;

    private final RedisTemplate<String, Object> redisTemplate;

    private Match buildMatch(MatchRequest matchRequest) {
        Match newMatch = Match.builder()
                .title(matchRequest.getTitle())
                .status(Status.NOT_STARTED)
                .startTime(matchRequest.getStartTime())
                .endTime(matchRequest.getEndTime())
                .build();

        List<MatchParticipant> participants = matchRequest.getParticipants()
                .stream()
                .map(universityName -> {
                    MatchParticipant participant = new MatchParticipant();
                    participant.setMatch(newMatch);
                    participant.setUniversity(universityRepository.findByName(universityName));
                    return participant;
                })
                .collect(Collectors.toList());

        if (participants.size() < 2) {
            throw new RuntimeException("Not enough participants for this match");
        }
        newMatch.setParticipants(participants);

        return newMatch;
    }

    private void buildMatchInRedis(MatchRequest matchRequest) {
        for (String participant : matchRequest.getParticipants()) {
            redisTemplate.opsForZSet().add("leaderboard:match:" + matchRequest.getId(), participant, 0);
        }
    }

    private MatchResponse buildMatchResponse(Match match) {
        return MatchResponse.builder()
                .id(match.getId())
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
                .toList();
    }

    private void updateEloToParticipants(Match match) {
        int minRank = 1000;
        List<University> universityList = new ArrayList<>();

        for (MatchParticipant participant : match.getParticipants()) {
            minRank = Math.min(minRank, participant.getRank());
            universityList.add(participant.getUniversity());
        }

        // Algo in here
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    protected void changeStatus() {
        for (Match match : matchRepository.findAllNotFinishedMatch()) {
            Instant now = Instant.now();
            if (match.getEndTime().isAfter(now)) {
                match.setStatus(Status.FINISHED);
                updateEloToParticipants(match);
            }
            else if (match.getStartTime().isAfter(now)) {
                match.setStatus(Status.PENDING);
            }
        }
    }

    public List<MatchResponse> getAllMatches() {
        return matchRepository.findAll()
                .stream()
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<MatchResponse> getAllNotStartedMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "NOT_STARTED".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<MatchResponse> getAllPendingMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "PENDING".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<MatchResponse> getAllFinishedMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "FINISHED".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<MatchParticipantResponse> getAllParticipants(long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        return  match.getParticipants()
                .stream()
                .map(MatchParticipantResponse::new)
                .toList();
    }

    public MatchResponse createMatch(MatchRequest matchRequest) {
        buildMatchInRedis(matchRequest);
        return buildMatchResponse(matchRepository.save(buildMatch(matchRequest)));
    }

    public MatchResponse updateMatchById(long id, MatchRequest matchRequest) {
        Match newMatch = buildMatch(matchRequest);
        newMatch.setId(id);
        return buildMatchResponse(matchRepository.save(newMatch));
    }

    public String deleteMatchById(long id) {
        matchRepository.deleteById(id);
        return "The match with id " + id + " has been deleted";
    }

}
