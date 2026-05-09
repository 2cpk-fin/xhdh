package com.uniranking.app.infrastructure.security;

import com.uniranking.app.domains.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import java.util.function.Function;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;

@Service
public class JwtServiceImpl implements JwtService{

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiry}")
    private long jwtExpiry;

    public String generateToken(UserDetails userDetails) {
        String displayName = ((User) userDetails).getDisplayUsername();
        String role = ((User) userDetails).getRole().name();

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("username", displayName)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiry))
                .signWith(getKey())
                .compact();
    }

    // Single parse — reused by all callers
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        return claimResolver.apply(extractAllClaims(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Parses once, checks both username and expiry from the same Claims object
    public boolean isTokenValid(String token, String email) {
        final Claims claims = extractAllClaims(token);
        final boolean isExpired = claims.getExpiration().before(new Date());
        return claims.getSubject().equals(email) && !isExpired;
    }

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}