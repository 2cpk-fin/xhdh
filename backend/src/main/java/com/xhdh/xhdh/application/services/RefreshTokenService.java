package com.xhdh.xhdh.application.services;


import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.xhdh.xhdh.domain.models.RefreshToken;
import com.xhdh.xhdh.domain.models.User;
import com.xhdh.xhdh.infrastructure.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RedisTemplate<String,Object> redisTemplate;
    private static final String REDIS_PREFIX = "rt:";
    private final JwtService jwtService;

    public RefreshToken createRefreshToken(User user, HttpServletRequest request){
        RefreshToken refreshToken = RefreshToken.builder()
                                                .userId(user.getId())
                                                .email(user.getEmail())
                                                .token(UUID.randomUUID().toString())
                                                .expiryDate(Instant.now().plusSeconds(60*60*24*7))
                                                .ipAddress(request.getRemoteAddr())
                                                .userAgent(request.getHeader("User-Agent"))
                                                .build();
        
        redisTemplate.opsForValue().set(
            REDIS_PREFIX + refreshToken.getToken(),
            refreshToken,
            Duration.ofDays(7));
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
    
    public void deleteRefreshToken(String token){
        redisTemplate.delete(REDIS_PREFIX + token);
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