package com.uniranking.app.domains.scheduleMatch.leaderboard;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ScheduleMatchLeaderboardService {
    private final RedisTemplate<String, Object> redisTemplate;

    private String getMatchKey(String matchId) {
        return "leaderboard:match:" + matchId;
    }

    public List<ScheduleParticipantResponse> showLeaderboard(String matchId) {
        String key = getMatchKey(matchId);

        Set<ZSetOperations.TypedTuple<Object>> participants = redisTemplate.opsForZSet().reverseRangeWithScores(key, 0, -1);

        List<ScheduleParticipantResponse> topParticipants = new ArrayList<>();

        // Null/Empty safety check
        if (participants == null || participants.isEmpty()) {
            return topParticipants;
        }

        int currentRank = 1; // Manage rank locally to avoid redundant Redis calls

        for (ZSetOperations.TypedTuple<Object> participant : participants) {
            ScheduleParticipantResponse response = new ScheduleParticipantResponse();

            int totalVotes = participant.getScore() != null ? participant.getScore().intValue() : 0;
            String universityName = participant.getValue() != null ? participant.getValue().toString() : "Unknown";

            response.setUniversityName(universityName);
            response.setTotalVotes(totalVotes);
            response.setRank(currentRank++); // Assign and then increment

            topParticipants.add(response);
        }

        return topParticipants;
    }
}