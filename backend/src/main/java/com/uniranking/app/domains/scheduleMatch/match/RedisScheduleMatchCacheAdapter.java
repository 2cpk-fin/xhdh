package com.uniranking.app.domains.scheduleMatch.match;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class RedisScheduleMatchCacheAdapter implements ScheduleMatchRedisPort {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${redis.status-prefix:status:match:}")
    private String statusPrefix;

    @Value("${redis.leaderboard-prefix:leaderboard:match:}")
    private String leaderboardPrefix;

    private static final String VOTER_TRACKER_PREFIX = "voters:";

    public RedisScheduleMatchCacheAdapter(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void initializeMatch(String publicMatchId, LocalDateTime startTime, List<Long> participantIds) {
        String statusKey = statusPrefix + publicMatchId;
        String leaderboardKey = leaderboardPrefix + publicMatchId;

        long secondsToStart = Duration.between(LocalDateTime.now(), startTime).getSeconds();
        Duration ttl = Duration.ofSeconds(Math.max(secondsToStart, 1));

        redisTemplate.opsForValue().set(statusKey, Status.NOT_STARTED.name(), ttl);

        for (Long participantId : participantIds) {
            redisTemplate.opsForZSet().add(leaderboardKey, participantId, 0);
        }
    }

    @Override
    public String getMatchStatus(String publicMatchId) {
        return (String) redisTemplate.opsForValue().get(statusPrefix + publicMatchId);
    }

    @Override
    public Long getUserVote(String publicMatchId, String userId) {
        Object voteObj = redisTemplate.opsForHash().get(VOTER_TRACKER_PREFIX + publicMatchId, userId);
        return (voteObj != null) ? Long.valueOf(voteObj.toString()) : null;
    }

    @Override
    public void recordNewVote(String publicMatchId, String userId, Long universityId) {
        redisTemplate.opsForHash().put(VOTER_TRACKER_PREFIX + publicMatchId, userId, universityId.toString());
        redisTemplate.opsForZSet().incrementScore(leaderboardPrefix + publicMatchId, universityId, 1.0);
    }

    @Override
    public void changeVote(String publicMatchId, String userId, Long oldUniversityId, Long newUniversityId) {
        redisTemplate.opsForZSet().incrementScore(leaderboardPrefix + publicMatchId, oldUniversityId, -1.0);
        redisTemplate.opsForZSet().incrementScore(leaderboardPrefix + publicMatchId, newUniversityId, 1.0);
        redisTemplate.opsForHash().put(VOTER_TRACKER_PREFIX + publicMatchId, userId, newUniversityId.toString());
    }
}