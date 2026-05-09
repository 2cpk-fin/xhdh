package com.uniranking.app.domains.auth.refreshToken;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import com.uniranking.app.domains.auth.exceptions.InvalidSessionException;
import com.uniranking.app.domains.auth.exceptions.RefreshTokenExpiredException;
import com.uniranking.app.domains.auth.exceptions.RefreshTokenNotFoundException;
import com.uniranking.app.domains.auth.exceptions.SuspiciousTokenUsageException;
import com.uniranking.app.infrastructure.security.JwtService;
import org.springframework.stereotype.Service;

import com.uniranking.app.domains.user.User;
import com.uniranking.app.infrastructure.security.JwtServiceImpl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRedisPort refreshTokenRedisPort;
    private final JwtService jwtServiceImpl;

    @Override
    public RefreshToken createRefreshToken(User user, HttpServletRequest request) {
        String publicUserId = String.valueOf(user.publicUserId);
        String existingTokenUuid = refreshTokenRedisPort.getActiveTokenIdForUser(publicUserId);

        if (existingTokenUuid != null) {
            refreshTokenRedisPort.deleteRefreshTokenData(existingTokenUuid);
        }

        String newTokenUUID = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .userId(user.getPublicUserId())
                .email(user.getEmail())
                .token(newTokenUUID)
                .expiryDate(Instant.now().plus(Duration.ofDays(7)))
                .ipAddress(request.getRemoteAddr())
                .userAgent(request.getHeader("User-Agent"))
                .build();

        refreshTokenRedisPort.storeRefreshToken(newTokenUUID, refreshToken, Duration.ofDays(7));
        refreshTokenRedisPort.mapUserToToken(publicUserId, newTokenUUID, Duration.ofDays(7));

        return refreshToken;
    }

    @Override
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRedisPort.getRefreshToken(token);

        if (refreshToken == null) {
            throw new RefreshTokenNotFoundException("Refresh token not found");
        }
        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RefreshTokenExpiredException("Refresh token expired");
        }

        return refreshToken;
    }

    @Override
    public void verifyMetaData(RefreshToken refreshToken, HttpServletRequest request) {
        String currentIp = request.getRemoteAddr();
        String currentAg = request.getHeader("User-Agent");

        if (!refreshToken.getIpAddress().equals(currentIp)) {
            throw new SuspiciousTokenUsageException("Refresh token IP address does not match");
        }
        if (!refreshToken.getUserAgent().equals(currentAg)) {
            throw new SuspiciousTokenUsageException("Refresh token user agent does not match");
        }
    }

    @Override
    public void deleteRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRedisPort.getRefreshToken(token);

        if (refreshToken != null) {
            refreshTokenRedisPort.removeUserTokenMapping(String.valueOf(refreshToken.getUserId()));
        }

        refreshTokenRedisPort.deleteRefreshTokenData(token);
    }

    @Override
    public void blackListAccessToken(String accessToken) {
        Date expiration = jwtServiceImpl.extractExpiration(accessToken);
        long ttl = expiration.getTime() - System.currentTimeMillis();

        if (ttl > 0) {
            refreshTokenRedisPort.blacklistToken(accessToken, Duration.ofMillis(ttl));
        }
    }

    @Override
    public boolean isAccessTokenBlacklisted(String accessToken) {
        return refreshTokenRedisPort.isBlacklisted(accessToken);
    }

    @Override
    public String getEmailFromToken(String token) {
        RefreshToken refreshToken = refreshTokenRedisPort.getRefreshToken(token);

        if (refreshToken == null) {
            throw new InvalidSessionException("Session invalid or expired");
        }

        return refreshToken.getEmail();
    }
}