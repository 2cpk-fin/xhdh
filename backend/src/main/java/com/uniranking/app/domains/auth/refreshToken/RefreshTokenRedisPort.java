package com.uniranking.app.domains.auth.refreshToken;

import java.time.Duration;

public interface RefreshTokenRedisPort {
    String getActiveTokenIdForUser(String publicUserId);
    void deleteRefreshTokenData(String tokenId);
    void storeRefreshToken(String tokenId, RefreshToken refreshToken, Duration ttl);
    void mapUserToToken(String publicUserId, String tokenId, Duration ttl);
    RefreshToken getRefreshToken(String tokenId);
    void removeUserTokenMapping(String publicUserId);
    void blacklistToken(String accessToken, Duration ttl);
    boolean isBlacklisted(String accessToken);
}