package com.uniranking.app.domains.auth.refreshToken;

import com.uniranking.app.domains.user.User;
import jakarta.servlet.http.HttpServletRequest;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user, HttpServletRequest request);
    RefreshToken verifyRefreshToken(String token);
    void verifyMetaData(RefreshToken refreshToken, HttpServletRequest request);
    void deleteRefreshToken(String token);
    void blackListAccessToken(String accessToken);
    boolean isAccessTokenBlacklisted(String accessToken);
    String getEmailFromToken(String token);
}