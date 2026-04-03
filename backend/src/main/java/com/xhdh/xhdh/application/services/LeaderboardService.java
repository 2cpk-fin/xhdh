package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.application.dto.matches.MatchParticipantResponse;
// import com.xhdh.xhdh.domain.models.Participant;
// import com.xhdh.xhdh.infrastructure.repositories.redis.LeaderboardRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    // private final LeaderboardRepository leaderboardRepository;

    private final RedisTemplate<String, Object> redisTemplate;

    private String getMatchKey(String matchId) {
        return "leaderboard:match:" + matchId;
    }

    public void vote(Long universityId, String matchId) {
        String key = getMatchKey(matchId);
        String member = universityId.toString();

        redisTemplate.opsForZSet().incrementScore(key, member, 1);
    }

    public List<MatchParticipantResponse> showLeaderboard(String matchId) {
        String key = getMatchKey(matchId);

        Set<ZSetOperations.TypedTuple<Object>> participants = redisTemplate.opsForZSet().reverseRangeWithScores(key, 0, -1);

        List<MatchParticipantResponse> topParticipants = new ArrayList<>();

        for (ZSetOperations.TypedTuple<Object> participant : participants) {
            MatchParticipantResponse participantResponse = new MatchParticipantResponse();

            int totalVotes = Objects.requireNonNull(participant.getScore()).intValue();
            Object universityName = Objects.requireNonNull(participant.getValue());

            Long rank = redisTemplate.opsForZSet().reverseRank(key, universityName);

            participantResponse.setUniversityName(universityName.toString());
            participantResponse.setTotalVotes(totalVotes);
            participantResponse.setRank(rank.intValue());

            topParticipants.add(participantResponse);
        }
        return topParticipants;
    }
}
