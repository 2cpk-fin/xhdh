package com.uniranking.app.domains.scheduleMatch.leaderboard;

import org.springframework.data.redis.core.ZSetOperations;

import java.util.Set;

public interface LeaderboardRedisPort {
    Set<ZSetOperations.TypedTuple<Object>> getParticipants(String matchId);
}
