package com.xhdh.xhdh.application.services;


import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.xhdh.xhdh.domain.models.authentication.RefreshToken;
import com.xhdh.xhdh.domain.models.authentication.User;
import com.xhdh.xhdh.infrastructure.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RedisTemplate<String,Object> redisTemplate;
    private static final String REDIS_PREFIX = "rt:";
    private static final String USER_RT_PREFIX = "user_rt:";
    private final JwtService jwtService;

    public RefreshToken createRefreshToken(User user, HttpServletRequest request) {
    // 1. Force the ID to a String for consistent Key naming
    String userUUIDStr = String.valueOf(user.getUserUUID());
    String userMappingKey = USER_RT_PREFIX + userUUIDStr;
    
    // 2. Lookup existing token UUID
    Object existingUuidObj = redisTemplate.opsForValue().get(userMappingKey);
    
    if (existingUuidObj != null) {
        String existingTokenUuid = existingUuidObj.toString();
        // Delete the old data key
        redisTemplate.delete(REDIS_PREFIX + existingTokenUuid);
    }

    // 3. Generate New Token
    String newTokenUUID = UUID.randomUUID().toString();
    RefreshToken refreshToken = RefreshToken.builder()
            .userUUID(user.getUserUUID())
            .email(user.getEmail())
            .token(newTokenUUID)
            .expiryDate(Instant.now().plus(Duration.ofDays(7)))
            .ipAddress(request.getRemoteAddr())
            .userAgent(request.getHeader("User-Agent"))
            .build();

    // 4. Save New Data & Update Mapping
    redisTemplate.opsForValue().set(REDIS_PREFIX + newTokenUUID, refreshToken, Duration.ofDays(7));
    redisTemplate.opsForValue().set(userMappingKey, newTokenUUID, Duration.ofDays(7));

    return refreshToken;
}

    public RefreshToken verifyRefreshToken(String token){
        RefreshToken refreshToken = (RefreshToken) redisTemplate.opsForValue().get(REDIS_PREFIX + token);
        if(refreshToken == null){
            throw new RuntimeException("Refresh token not found");
        }
        if(refreshToken.getExpiryDate().isBefore(Instant.now())){
            throw new RuntimeException("Refresh token expired");
        }
        return refreshToken;
    }

    public void verifyMetaData(RefreshToken refreshToken, HttpServletRequest request){
        String currentIp = request.getRemoteAddr();
        String currentAg = request.getHeader("User-Agent");

        if(!refreshToken.getIpAddress().equals(currentIp)){
            throw new RuntimeException("Refresh token IP address does not match");
        }
        if(!refreshToken.getUserAgent().equals(currentAg)){
            throw new RuntimeException("Refresh token user agent does not match");
        }
    }

    public Optional<RefreshToken> findByToken(String token){
        RefreshToken refreshToken = (RefreshToken) redisTemplate.opsForValue().get(REDIS_PREFIX + token);
        return Optional.ofNullable(refreshToken);
    }
    
    public void deleteRefreshToken(String token) {
    String tokenKey = REDIS_PREFIX + token;
    
    // 1. Retrieve the token data so we know WHICH user this belongs to
    RefreshToken refreshToken = (RefreshToken) redisTemplate.opsForValue().get(tokenKey);
    
    if (refreshToken != null) {
        // 2. Delete the User -> Token mapping (the "index")
        String userMappingKey = USER_RT_PREFIX + String.valueOf(refreshToken.getUserUUID());
        redisTemplate.delete(userMappingKey);
        
        // 3. Delete the actual Token data
        redisTemplate.delete(tokenKey);
        
        System.out.println("Successfully terminated session for User ID: " + refreshToken.getUserUUID());
    } else {
        // Fallback: Just try to delete the token key anyway if the data is already gone
        redisTemplate.delete(tokenKey);
    }
}

    public void blackListAccessToken(String accessToken){
        Date expiration = jwtService.extractExpiration(accessToken);
        long ttl = expiration.getTime() - System.currentTimeMillis();
        if(ttl > 0){
            redisTemplate.opsForValue().set("bl:" + accessToken,"logout", Duration.ofMillis(ttl));
        }
    }

    public boolean isAccessTokenBlacklisted(String accessToken){
        return Boolean.TRUE.equals(redisTemplate.hasKey("bl:" + accessToken));
    }


}