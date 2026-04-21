package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantMapper;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import com.uniranking.app.domains.searching.university.University;
import com.uniranking.app.domains.searching.university.UniversityRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleMatchService {
    private final ScheduleMatchRepository scheduleMatchRepository;
    private final UniversityRepository universityRepository;

    private final ScheduleMatchMapper scheduleMatchMapper;
    private final ScheduleParticipantMapper scheduleParticipantMapper;

    private final RedisTemplate<String, Object> redisTemplate;

    private String getMatchKey(String matchId) {
        return "leaderboard:match:" + matchId;
    }

    private void buildMatchInRedis(ScheduleMatchRequest scheduleMatchRequest, Long matchId) {
        ScheduleMatch scheduleMatch = scheduleMatchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        String matchKey = String.valueOf(scheduleMatch.getId());

        for (String participant : scheduleMatchRequest.getParticipants()) {
            redisTemplate.opsForZSet().add("leaderboard:match:" + matchKey, participant, 0);
        }
    }

    @Transactional
    protected void divideGroup(ScheduleMatch scheduleMatch) {
        String key = getMatchKey(String.valueOf(scheduleMatch.getId()));
        var typedTuples = redisTemplate.opsForZSet().reverseRangeWithScores(key, 0, -1);

        if (typedTuples == null || typedTuples.isEmpty()) return;

        List<ZSetOperations.TypedTuple<Object>> list = new ArrayList<>(typedTuples);
        syncVotesToDatabase(scheduleMatch, list);

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

    private void syncVotesToDatabase(ScheduleMatch scheduleMatch, List<ZSetOperations.TypedTuple<Object>> results) {
        for (int rank = 0; rank < results.size(); rank++) {
            var tuple = results.get(rank);
            String universityName = (String) tuple.getValue();
            int finalVotes = (int) Math.round(tuple.getScore() != null ? tuple.getScore() : 0.0);

            int currentRank = rank + 1;

            scheduleMatch.getParticipants().stream()
                    .filter(p -> p.getUniversity().getName().equals(universityName))
                    .findFirst()
                    .ifPresent(participant -> {
                        participant.setTotalVotes(finalVotes);
                        participant.setRank(currentRank);
                    });
        }
        scheduleMatchRepository.save(scheduleMatch);
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
        ScheduleMatch scheduleMatch = scheduleMatchRepository.findById(Long.parseLong(matchId))
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (scheduleMatch.getStatus().equals(Status.PENDING)) {
            String key = getMatchKey(matchId);
            redisTemplate.opsForZSet().incrementScore(key, universityName, 1);
        }
        else if (scheduleMatch.getStatus().equals(Status.NOT_STARTED)) {
            throw new RuntimeException("Match has not started yet");
        }
        else {
            throw new RuntimeException("Match has already ended");
        }
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    protected void changeStatus() {
        for (ScheduleMatch scheduleMatch : scheduleMatchRepository.findAllNotFinishedMatch()) {
            Instant now = Instant.now();

            if (now.isAfter(scheduleMatch.getEndTime().toInstant(ZoneOffset.UTC))) {
                scheduleMatch.setStatus(Status.FINISHED);
                scheduleMatchRepository.save(scheduleMatch);
                divideGroup(scheduleMatch);
            }
            else if (now.isAfter(scheduleMatch.getStartTime().toInstant(ZoneOffset.UTC))) {
                scheduleMatch.setStatus(Status.PENDING);
                scheduleMatchRepository.save(scheduleMatch);
            }
        }
    }

    public List<ScheduleMatchResponse> getAllMatches() {
        return scheduleMatchRepository.findAll()
                .stream()
                .map(scheduleMatchMapper::toScheduleMatchResponse)
                .toList();
    }

    public List<ScheduleMatchResponse> getAllNotStartedMatches() {
        return scheduleMatchRepository.findAll()
                .stream()
                .filter(match -> "NOT_STARTED".equals(String.valueOf(match.getStatus())))
                .map(scheduleMatchMapper::toScheduleMatchResponse)
                .toList();
    }

    public List<ScheduleMatchResponse> getAllPendingMatches() {
        return scheduleMatchRepository.findAll()
                .stream()
                .filter(match -> "PENDING".equals(String.valueOf(match.getStatus())))
                .map(scheduleMatchMapper::toScheduleMatchResponse)
                .toList();
    }

    public List<ScheduleMatchResponse> getAllFinishedMatches() {
        return scheduleMatchRepository.findAll()
                .stream()
                .filter(match -> "FINISHED".equals(String.valueOf(match.getStatus())))
                .map(scheduleMatchMapper::toScheduleMatchResponse)
                .toList();
    }

    public List<ScheduleParticipantResponse> getAllParticipants(long id) {
        ScheduleMatch scheduleMatch = scheduleMatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        return scheduleMatch.getParticipants()
                .stream()
                .map(scheduleParticipantMapper::toScheduleParticipantResponse)
                .toList();
    }

    public ScheduleMatchResponse createMatch(ScheduleMatchRequest scheduleMatchRequest) {
        ScheduleMatch newScheduleMatch = scheduleMatchMapper.toScheduleMatch(scheduleMatchRequest);
        scheduleMatchRepository.save(newScheduleMatch);
        buildMatchInRedis(scheduleMatchRequest, newScheduleMatch.getId());
        return scheduleMatchMapper.toScheduleMatchResponse(newScheduleMatch);
    }

    public ScheduleMatchResponse updateMatchById(long id, ScheduleMatchRequest scheduleMatchRequest) {
        ScheduleMatch updatedMatch = scheduleMatchMapper.toScheduleMatch(scheduleMatchRequest);
        updatedMatch.setId(id);
        return scheduleMatchMapper.toScheduleMatchResponse(scheduleMatchRepository.save(updatedMatch));
    }

    public String deleteMatchById(long id) {
        scheduleMatchRepository.deleteById(id);
        return "The match with id " + id + " has been deleted";
    }

}