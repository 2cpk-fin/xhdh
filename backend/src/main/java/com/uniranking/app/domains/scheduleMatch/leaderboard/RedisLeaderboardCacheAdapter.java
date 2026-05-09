package com.uniranking.app.domains.scheduleMatch.leaderboard;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class RedisLeaderboardCacheAdapter implements LeaderboardRedisPort {

    private final RedisTemplate<String, Object> redisTemplate;
    private final String prefix = "leaderboard:match:";

    public RedisLeaderboardCacheAdapter(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Set<ZSetOperations.TypedTuple<Object>> getParticipants(String matchId) {
        return redisTemplate.opsForZSet().rangeWithScores(prefix + matchId, 0, 99);
    }
}
