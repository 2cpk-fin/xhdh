package com.uniranking.app.domains.soloMatch;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
public class RedisSoloMatchCacheAdapter implements SoloMatchRedisPort {

    private final RedisTemplate<String, Object> redisTemplate;
    private final String prefix = "solo_match:";

    public RedisSoloMatchCacheAdapter(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void saveMatch(SoloMatch match, long ttlInMinutes) {
        redisTemplate.opsForValue().set(prefix + match.getPublicMatchId(), match, ttlInMinutes, TimeUnit.MINUTES);
    }

    @Override
    public SoloMatch getMatch(UUID matchId) {
        return (SoloMatch) redisTemplate.opsForValue().get(prefix + matchId);
    }

    @Override
    public void deleteMatch(UUID matchId) {
        redisTemplate.delete(prefix + matchId);
    }

}
