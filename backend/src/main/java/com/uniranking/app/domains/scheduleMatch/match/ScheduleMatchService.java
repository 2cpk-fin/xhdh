package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipant;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantMapper;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import com.uniranking.app.domains.searching.university.UniversityRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
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
    private static final String STATUS_PREFIX = "status:match:";
    private static final String LEADERBOARD_PREFIX = "leaderboard:match:";

    private void buildMatchInRedis(ScheduleMatchRequest request, ScheduleMatch scheduleMatch) {
        String matchKey = String.valueOf(scheduleMatch.getPublicMatchId());
        String statusKey = STATUS_PREFIX + matchKey;
        String leaderboardKey = LEADERBOARD_PREFIX + matchKey;

        // The keys are expired from the moment we create the match
        // Until the end time
        long secondsToStart = java.time.Duration.between(
                LocalDateTime.now(),
                request.getStartTime()).getSeconds();
        Duration ttl = Duration.ofSeconds(Math.max(secondsToStart, 1));
        redisTemplate.opsForValue().set(statusKey, Status.NOT_STARTED.name(), ttl);

        // Data key for leaderboard
        for (Long participantId : request.getUniIds()) {
            redisTemplate.opsForZSet().add(leaderboardKey, participantId, 0);
        }
    }

    @CacheEvict(value = "leaderboard", key = "#publicMatchId")
    public void vote(Long universityId, String publicMatchId, Authentication authentication) {
        String matchKey = String.valueOf(publicMatchId);
        String statusKey = STATUS_PREFIX + matchKey;
        String leaderboardKey = LEADERBOARD_PREFIX + matchKey;
        String voterTrackerKey = "voters:" + matchKey;

        // Validate the match status for voting
        String currentStatus = (String) redisTemplate.opsForValue().get(statusKey);
        if (currentStatus == null) {
            throw new RuntimeException("Match not found or already finished");
        } else if (Status.NOT_STARTED.name().equals(currentStatus)) {
            throw new RuntimeException("Match has not started yet");
        }

        // Get existing vote
        String userId = authentication.getName();
        Object voteObj = redisTemplate.opsForHash().get(voterTrackerKey, userId);
        Long oldUniversityId = (voteObj != null) ? Long.valueOf(voteObj.toString()) : null;

        if (oldUniversityId == null) {
            // First time voting
            redisTemplate.opsForHash().put(voterTrackerKey, userId, universityId.toString());
            redisTemplate.opsForZSet().incrementScore(leaderboardKey, universityId, 1.0);
        } else if (!oldUniversityId.equals(universityId)) {
            // Changing vote
            redisTemplate.opsForZSet().incrementScore(leaderboardKey, oldUniversityId, -1.0);
            redisTemplate.opsForZSet().incrementScore(leaderboardKey, universityId, 1.0);
            // Update the tracker
            redisTemplate.opsForHash().put(voterTrackerKey, userId, universityId.toString());
        } else {
            throw new RuntimeException("You already voted for this university!");
        }
    }

    public Page<ScheduleMatchResponse> getAllMatches(int pageNo, int size) {
        return scheduleMatchRepository.findAll(PageRequest.of(pageNo, size)).map(scheduleMatchMapper::toScheduleMatchResponse);
    }


    public List<ScheduleMatchResponse> getAllNotStartedMatches() {
        return scheduleMatchRepository.findAllNotStartedMatch()
                .stream()
                .map(scheduleMatchMapper::toScheduleMatchResponse)
                .toList();
    }

    public List<ScheduleMatchResponse> getAllPendingMatches() {
        return scheduleMatchRepository.findAllPendingMatch()
                .stream()
                .map(scheduleMatchMapper::toScheduleMatchResponse)
                .toList();
    }

    public List<ScheduleMatchResponse> getAllFinishedMatches() {
        return scheduleMatchRepository.findAllFinishedMatch()
                .stream()
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

    // For admin
    @Transactional
    public ScheduleMatchResponse createMatch(ScheduleMatchRequest scheduleMatchRequest) {
        // Validate the time
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = scheduleMatchRequest.getStartTime();
        LocalDateTime endTime = scheduleMatchRequest.getEndTime();

        if (startTime.isBefore(now)) {
            throw new RuntimeException("Start time must be at least 1 day later than the current time.");
        }
        if (endTime.isBefore(startTime.plusDays(1))) {
            throw new RuntimeException("End time must be at least 1 day after the start time.");
        }

        // Create match without participants (mapper ignores them)
        ScheduleMatch newScheduleMatch = scheduleMatchMapper.toScheduleMatch(scheduleMatchRequest);

        // Explicitly create and associate participants
        List<ScheduleParticipant> participants = new ArrayList<>();
        if (scheduleMatchRequest.getUniIds() != null && !scheduleMatchRequest.getUniIds().isEmpty()) {
            for (Long uniId : scheduleMatchRequest.getUniIds()) {
                ScheduleParticipant participant = new ScheduleParticipant();
                participant.setScheduleMatch(newScheduleMatch);
                participant.setUniversity(universityRepository.findById(uniId)
                        .orElseThrow(() -> new RuntimeException("University with id " + uniId + " not found")));
                participants.add(participant);
            }
        }

        if (participants.size() < 2) {
            throw new RuntimeException("A match must have at least 2 participants");
        }

        newScheduleMatch.setParticipants(participants);
        scheduleMatchRepository.save(newScheduleMatch);
        buildMatchInRedis(scheduleMatchRequest, newScheduleMatch);

        return scheduleMatchMapper.toScheduleMatchResponse(newScheduleMatch);
    }

    public ScheduleMatchResponse updateMatchById(long id, ScheduleMatchRequest scheduleMatchRequest) {
        ScheduleMatch existingMatch = scheduleMatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));
        scheduleMatchMapper.updateMatchFromRequest(scheduleMatchRequest, existingMatch);
        ScheduleMatch savedMatch = scheduleMatchRepository.save(existingMatch);
        return scheduleMatchMapper.toScheduleMatchResponse(savedMatch);
    }

    public String deleteMatchById(long id) {
        scheduleMatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));
        scheduleMatchRepository.deleteById(id);
        return "The match with id " + id + " has been deleted";
    }

}