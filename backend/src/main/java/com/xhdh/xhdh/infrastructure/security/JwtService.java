package com.xhdh.xhdh.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;

@Service

public class JwtService {

    @Value("${jwt.secret}")

    private String jwtSecret;

    @Value("${jwt.expiry}")

    private long jwtExpiry;    



    public SecretKey getSecretKey(){

        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);

        return Keys.hmacShaKeyFor(keyBytes);

    }

    public String generateToken(UserDetails userDetails){

        return generateToken(new HashMap<>() , userDetails);

    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails){

        return Jwts.builder()
                    .setClaims(extraClaims)
                    .setSubject(userDetails.getUsername())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpiry))
                    .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                    .compact();
    }
    
    public Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims,T> claimResolver){
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }



    public boolean isTokenValid(String token, UserDetails userDetails){
        final String email = extractUsername(token);
        return (email.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }
}