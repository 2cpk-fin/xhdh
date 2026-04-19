package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.application.dto.match.ParticipantResponse;
import com.xhdh.xhdh.application.dto.match.ScheduleMatchRequest;
import com.xhdh.xhdh.application.dto.match.ScheduleMatchResponse;
import com.xhdh.xhdh.domain.models.match.Match;
import com.xhdh.xhdh.domain.models.match.MatchParticipant;
import com.xhdh.xhdh.domain.models.match.Status;
import com.xhdh.xhdh.domain.models.search.University;
import com.xhdh.xhdh.infrastructure.repositories.jpa.MatchRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UniversityRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
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

    private Match buildMatch(ScheduleMatchRequest scheduleMatchRequest) {
        Match newMatch = Match.builder()
                .title(scheduleMatchRequest.getTitle())
                .status(Status.NOT_STARTED)
                .startTime(scheduleMatchRequest.getStartTime())
                .endTime(scheduleMatchRequest.getEndTime())
                .build();

        List<MatchParticipant> participants = scheduleMatchRequest.getParticipants()
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

    private void buildMatchInRedis(ScheduleMatchRequest scheduleMatchRequest, Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        String matchKey = String.valueOf(match.getId());

        for (String participant : scheduleMatchRequest.getParticipants()) {
            redisTemplate.opsForZSet().add("leaderboard:match:" + matchKey, participant, 0);
        }
    }

    private ScheduleMatchResponse buildMatchResponse(Match match) {
        return ScheduleMatchResponse.builder()
                .publicMatchId(match.getPublicMatchId())
                .matchId(match.getId())
                .title(match.getTitle())
                .status(String.valueOf(match.getStatus()))
                .participants(buildParticipantResponses(match))
                .startTime(match.getStartTime())
                .endTime(match.getEndTime())
                .build();
    }

    private List<ParticipantResponse> buildParticipantResponses(Match match) {
        return match.getParticipants()
                .stream()
                .map(ParticipantResponse::new)
                .toList();
    }

    private void divideGroup(Match match) {
        String key = getMatchKey(String.valueOf(match.getId()));
        var typedTuples = redisTemplate.opsForZSet().reverseRangeWithScores(key, 0, -1);

        if (typedTuples == null || typedTuples.isEmpty()) return;

        List<ZSetOperations.TypedTuple<Object>> list = new ArrayList<>(typedTuples);
        syncVotesToDatabase(match, list);

        int totalSize = list.size();
        int groupSize = totalSize / 3;
        int extra = totalSize % 3;

        int endGroup1 = groupSize + (extra > 0 ? 1 : 0);
        int endGroup2 = endGroup1 + groupSize + (extra > 1 ? 1 : 0);

        // Call the group processing function for each segment
        calculateAndApplyGroupElo(list.subList(0, endGroup1), 1.0);
        calculateAndApplyGroupElo(list.subList(endGroup1, endGroup2),  0.0);
        calculateAndApplyGroupElo(list.subList(endGroup2, totalSize), -1.0);

        redisTemplate.delete(key);
    }

    private void syncVotesToDatabase(Match match, List<ZSetOperations.TypedTuple<Object>> results) {
        for (int rank = 0; rank < results.size(); rank++) {
            var tuple = results.get(rank);
            String universityName = (String) tuple.getValue();
            int finalVotes = (int) Math.round(tuple.getScore() != null ? tuple.getScore() : 0.0);

            int currentRank = rank + 1;

            match.getParticipants().stream()
                    .filter(p -> p.getUniversity().getName().equals(universityName))
                    .findFirst()
                    .ifPresent(participant -> {
                        participant.setTotalVotes(finalVotes);
                        participant.setRank(currentRank);
                    });
        }
        matchRepository.save(match);
    }

    private void calculateAndApplyGroupElo(List<ZSetOperations.TypedTuple<Object>> group, double modifier) {
        if (group.isEmpty()) return;
        double baseReward = 20.0;

        double sigmaV = group.stream()
                .mapToDouble(tuple -> tuple.getScore() != null ? tuple.getScore() : 0.0)
                .sum();

        for (var tuple : group) {
            String universityName = (String) tuple.getValue();
            double vi = tuple.getScore() != null ? tuple.getScore() : 0.0;

            // Formula implementation: ((vi / sigmaV) + modifier) * baseReward
            double eloChange = ((sigmaV == 0 ? 0 : vi / sigmaV) + modifier) * baseReward;

            applyEloToUniversity(universityName, (int) Math.round(eloChange));
        }
    }

    private void applyEloToUniversity(String universityName, int eloChange) {
        University university = universityRepository.findByName(universityName);
        if (university != null) {
            university.setElo(university.getElo() + eloChange);
            universityRepository.save(university);
        }
    }

    public void vote(String universityName, String matchId) {
        Match match = matchRepository.findById(Long.parseLong(matchId))
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus().equals(Status.PENDING)) {
            String key = getMatchKey(matchId);
            redisTemplate.opsForZSet().incrementScore(key, universityName, 1);
        }
        else if (match.getStatus().equals(Status.NOT_STARTED)) {
            throw new RuntimeException("Match has not started yet");
        }
        else {
            throw new RuntimeException("Match has already ended");
        }
    }

    private String getMatchKey(String matchId) {
        return "leaderboard:match:" + matchId;
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    protected void changeStatus() {
        for (Match match : matchRepository.findAllNotFinishedMatch()) {
            Instant now = Instant.now();
            if (now.isAfter(Instant.from(match.getEndTime()))) {
                match.setStatus(Status.FINISHED);
                matchRepository.save(match);
                divideGroup(match);
            }
            else if (now.isAfter(Instant.from(match.getStartTime()))) {
                match.setStatus(Status.PENDING);
                matchRepository.save(match);
            }
        }
    }

    public List<ScheduleMatchResponse> getAllMatches() {
        return matchRepository.findAll()
                .stream()
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<ScheduleMatchResponse> getAllNotStartedMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "NOT_STARTED".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<ScheduleMatchResponse> getAllPendingMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "PENDING".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<ScheduleMatchResponse> getAllFinishedMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "FINISHED".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<ParticipantResponse> getAllParticipants(long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        return  match.getParticipants()
                .stream()
                .map(ParticipantResponse::new)
                .toList();
    }

    public ScheduleMatchResponse createMatch(ScheduleMatchRequest scheduleMatchRequest) {
        Match newMatch = buildMatch(scheduleMatchRequest);
        matchRepository.save(newMatch);
        buildMatchInRedis(scheduleMatchRequest, newMatch.getId());
        return buildMatchResponse(newMatch);
    }

    public ScheduleMatchResponse updateMatchById(long id, ScheduleMatchRequest scheduleMatchRequest) {
        Match newMatch = buildMatch(scheduleMatchRequest);
        newMatch.setId(id);
        return buildMatchResponse(matchRepository.save(newMatch));
    }

    public String deleteMatchById(long id) {
        matchRepository.deleteById(id);
        return "The match with id " + id + " has been deleted";
    }

}
