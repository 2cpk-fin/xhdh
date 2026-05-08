package com.uniranking.app.domains.auth.refreshToken;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import com.uniranking.app.domains.auth.exceptions.InvalidSessionException;
import com.uniranking.app.domains.auth.exceptions.RefreshTokenExpiredException;
import com.uniranking.app.domains.auth.exceptions.RefreshTokenNotFoundException;
import com.uniranking.app.domains.auth.exceptions.SuspiciousTokenUsageException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.uniranking.app.domains.user.User;
import com.uniranking.app.infrastructure.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String REDIS_PREFIX = "rt:";
    private static final String USER_RT_PREFIX = "user_rt:";
    private final JwtService jwtService;

    public RefreshToken createRefreshToken(User user, HttpServletRequest request) {
    // First, get the UUID of the User
    String publicUserId = String.valueOf(user.publicUserId);
    String userMappingKey = USER_RT_PREFIX + publicUserId;
    
    // Second, check if there's existing key
    Object existingUuidObj = redisTemplate.opsForValue().get(userMappingKey);
    
    if (existingUuidObj != null) {
        String existingTokenUuid = existingUuidObj.toString();
        // Delete the old data key
        redisTemplate.delete(REDIS_PREFIX + existingTokenUuid);
    }

    // Create a new refresh token
    String newTokenUUID = UUID.randomUUID().toString();
    RefreshToken refreshToken = RefreshToken.builder()
            .userId(user.getPublicUserId())
            .email(user.getEmail())
            .token(newTokenUUID)
            .expiryDate(Instant.now().plus(Duration.ofDays(7)))
            .ipAddress(request.getRemoteAddr())
            .userAgent(request.getHeader("User-Agent"))
            .build();

    // Save new data and update mapping
    redisTemplate.opsForValue().set(REDIS_PREFIX + newTokenUUID, refreshToken, Duration.ofDays(7));
    redisTemplate.opsForValue().set(userMappingKey, newTokenUUID, Duration.ofDays(7));

    return refreshToken;
}

    // Check if the token is old or fake
    public RefreshToken verifyRefreshToken(String token){
        RefreshToken refreshToken = (RefreshToken) redisTemplate.opsForValue().get(REDIS_PREFIX + token);
        if (refreshToken == null){
            throw new RefreshTokenNotFoundException("Refresh token not found");
        }
        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RefreshTokenExpiredException("Refresh token expired");
        }
        return refreshToken;
    }

    // Check if the IP and Agent are correct
    public void verifyMetaData(RefreshToken refreshToken, HttpServletRequest request){
        String currentIp = request.getRemoteAddr();
        String currentAg = request.getHeader("User-Agent");

        if (!refreshToken.getIpAddress().equals(currentIp)){
            throw new SuspiciousTokenUsageException("Refresh token IP address does not match");
        }
        if (!refreshToken.getUserAgent().equals(currentAg)){
            throw new SuspiciousTokenUsageException("Refresh token user agent does not match");
        }
    }

    // Delete the token
    public void deleteRefreshToken(String token) {
        String tokenKey = REDIS_PREFIX + token;

        // Retrieve the token data so we know WHICH user this belongs to
        RefreshToken refreshToken = (RefreshToken) redisTemplate.opsForValue().get(tokenKey);

        if (refreshToken != null) {
            // Delete the User -> Token mapping (the "index")
            String userMappingKey = USER_RT_PREFIX + refreshToken.getUserId();
            redisTemplate.delete(userMappingKey);

            // Delete the actual Token data
            redisTemplate.delete(tokenKey);
        }
        else {
            // Fallback: Just try to delete the token key anyway if the data is already gone
            redisTemplate.delete(tokenKey);
        }
    }

    public void blackListAccessToken(String accessToken){
        Date expiration = jwtService.extractExpiration(accessToken);
        long ttl = expiration.getTime() - System.currentTimeMillis();
        if (ttl > 0) {
            redisTemplate.opsForValue().set("bl:" + accessToken,"logout", Duration.ofMillis(ttl));
        }
    }

    public boolean isAccessTokenBlacklisted(String accessToken){
        return redisTemplate.hasKey("bl:" + accessToken);
    }

    public String getEmailFromToken(String token) {
        String tokenKey = REDIS_PREFIX + token;
        RefreshToken refreshToken = (RefreshToken) redisTemplate.opsForValue().get(tokenKey);

        if (refreshToken == null) {
            throw new InvalidSessionException("Session invalid or expired");
        }

        return refreshToken.getEmail();
    }
}