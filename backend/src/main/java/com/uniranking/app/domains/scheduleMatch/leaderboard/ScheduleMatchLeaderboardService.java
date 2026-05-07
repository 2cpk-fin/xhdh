package com.uniranking.app.domains.scheduleMatch.leaderboard;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import com.uniranking.app.domains.searching.university.UniversityMapper;
import com.uniranking.app.domains.searching.university.UniversityResponse;
import com.uniranking.app.domains.searching.university.UniversityService;
import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ScheduleMatchLeaderboardService {
    private final UniversityService universityService;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String LEADERBOARD_PREFIX = "leaderboard:match:";

    // TODO: Fix the N + 1 Problem in Redis
    @Cacheable(value = "leaderboard", key = "#publicMatchId")
    public List<ScheduleParticipantResponse> showLeaderboard(String publicMatchId) {
        String leaderboardKey = LEADERBOARD_PREFIX + publicMatchId;
        Set<ZSetOperations.TypedTuple<Object>> participants = redisTemplate.opsForZSet()
                .reverseRangeWithScores(leaderboardKey, 0, 99);

        if (participants == null || participants.isEmpty()) {
            return new ArrayList<>();
        }

        List<ScheduleParticipantResponse> topScores = new ArrayList<>();
        int currentRank = 1;

        for (ZSetOperations.TypedTuple<Object> participant : participants) {
            if (participant != null && participant.getValue() != null) {

                Long universityId = Long.parseLong(participant.getValue().toString());
                int totalVotes = (participant.getScore() != null) ? participant.getScore().intValue() : 0;

                UniversityResponse university = universityService.getUniversityById(universityId);

                if (university != null) {

                    ScheduleParticipantResponse participantResponse = new ScheduleParticipantResponse();
                    participantResponse.setUniversityResponse(university);
                    participantResponse.setTotalVotes(totalVotes);
                    participantResponse.setRank(currentRank);

                    topScores.add(participantResponse);
                    currentRank++;
                }
            }
        }

        return topScores;
    }
}

// Architecture Note: Read and Write trade-off
/*
    Case 1: If there's more readers than writers
    In this scenario, we don't want to call the method show leaderboard thousands of time, this will waste the Upstash resource
    Using @Cacheable for leaderboard and @CacheEvict for vote, we'll prevent hitting the method too much, and fetch directly from the Redis
*/
/*
    Case 2: If there's more writers than readers
    In this case, we'll remove the @Cacheable and @CacheEvict
    Because many writers are writing at the same time, the network will constantly call the method
    If we still use Annotations, then it will become double caching, wasting the resources
*/

// Why the network calls the api too much? Technically, check the FE!