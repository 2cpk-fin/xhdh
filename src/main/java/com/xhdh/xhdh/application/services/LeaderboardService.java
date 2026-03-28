package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.domain.models.Participant;
import com.xhdh.xhdh.infrastructure.repositories.LeaderboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class LeaderboardService {
    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public List<Participant> showLeaderboard() {
        String key = "leaderboard:participants";

        Set<ZSetOperations.TypedTuple<Object>> typedTuples = redisTemplate.opsForZSet().reverseRangeWithScores(key, 0, 14);

        return typedTuples.stream()
                .map(tuple -> {
                    Participant participant = (Participant) tuple.getValue();
                    if (participant != null && tuple.getScore() != null) {
                        participant.setVote(tuple.getScore().intValue());
                    }
                    return participant;
                })
                .toList();
    }
}
