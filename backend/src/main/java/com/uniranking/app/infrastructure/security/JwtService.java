package com.uniranking.app.infrastructure.security;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.function.Function;

public interface JwtService {
    String generateToken(UserDetails userDetails);
    Claims extractAllClaims(String token);
    <T> T extractClaim(String token, Function<Claims, T> claimResolver);
    String extractUsername(String token);
    Date extractExpiration(String token);
    boolean isTokenValid(String token, String email);
}