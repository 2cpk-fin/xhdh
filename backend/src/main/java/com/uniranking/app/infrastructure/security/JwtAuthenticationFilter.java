package com.uniranking.app.infrastructure.security;

import com.uniranking.app.domains.auth.refreshToken.RefreshTokenService;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final RefreshTokenService refreshTokenServiceImpl;
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @Nonnull HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nonnull FilterChain filterChain
    ) throws ServletException, IOException {

        final String jwt;
        final String authHeader = request.getHeader("Authorization");

        // Exit early if no token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the token
        jwt = authHeader.substring(7).trim();

        // Check if the token is blacklisted
        if(refreshTokenServiceImpl.isAccessTokenBlacklisted(jwt)){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            final String userEmail = jwtService.extractUsername(jwt);
            final String role = jwtService.extractClaim(jwt, claims -> claims.get("role", String.class));

            if (userEmail != null && jwtService.isTokenValid(jwt, userEmail)) {
                // Create the granted authority
                List<GrantedAuthority> grantedAuthorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

                // Create the authentication token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userEmail,
                        null,
                        grantedAuthorities
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        catch (Exception e) {
            log.warn("JWT validation failed: {}", e.getMessage());
            // We do NOT stop the chain here; we just don't set the Authentication
        }

        // This is the ONLY place doFilter is called if a token was present
        filterChain.doFilter(request, response);
    }
}