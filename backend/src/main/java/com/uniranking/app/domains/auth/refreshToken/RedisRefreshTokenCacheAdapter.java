package com.uniranking.app.domains.auth.refreshToken;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class RedisRefreshTokenCacheAdapter implements RefreshTokenRedisPort {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${redis.prefix:rt:}")
    private String redisPrefix;

    @Value("${redis.user-prefix:user_rt:}")
    private String userRtPrefix;

    @Value("${redis.blacklist-prefix:bl:}")
    private String blacklistPrefix;

    public RedisRefreshTokenCacheAdapter(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public String getActiveTokenIdForUser(String publicUserId) {
        Object existingUuidObj = redisTemplate.opsForValue().get(userRtPrefix + publicUserId);
        return existingUuidObj != null ? existingUuidObj.toString() : null;
    }

    @Override
    public void deleteRefreshTokenData(String tokenId) {
        redisTemplate.delete(redisPrefix + tokenId);
    }

    @Override
    public void storeRefreshToken(String tokenId, RefreshToken refreshToken, Duration ttl) {
        redisTemplate.opsForValue().set(redisPrefix + tokenId, refreshToken, ttl);
    }

    @Override
    public void mapUserToToken(String publicUserId, String tokenId, Duration ttl) {
        redisTemplate.opsForValue().set(userRtPrefix + publicUserId, tokenId, ttl);
    }

    @Override
    public RefreshToken getRefreshToken(String tokenId) {
        return (RefreshToken) redisTemplate.opsForValue().get(redisPrefix + tokenId);
    }

    @Override
    public void removeUserTokenMapping(String publicUserId) {
        redisTemplate.delete(userRtPrefix + publicUserId);
    }

    @Override
    public void blacklistToken(String accessToken, Duration ttl) {
        redisTemplate.opsForValue().set(blacklistPrefix + accessToken, "logout", ttl);
    }

    @Override
    public boolean isBlacklisted(String accessToken) {
        return redisTemplate.hasKey(blacklistPrefix + accessToken);
    }
}