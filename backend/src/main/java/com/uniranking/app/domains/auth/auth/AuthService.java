package com.uniranking.app.domains.auth.auth;

import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest, HttpServletRequest httpRequest);
    AuthResponse login(LoginRequest loginRequest, HttpServletRequest httpRequest);
    AuthResponse refreshToken(String token, HttpServletRequest httpRequest);
    LogoutResponse logout(LogoutRequest request);
}
