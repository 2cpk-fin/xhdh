package com.xhdh.xhdh.infrastructure.security;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.xhdh.xhdh.application.services.RefreshTokenService;
import com.xhdh.xhdh.domain.models.AuthProvider;
import com.xhdh.xhdh.domain.models.User;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler{
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException{
    OAuth2User googleUser = (OAuth2User) authentication.getPrincipal();
    String email = googleUser.getAttribute("email");
    String name = googleUser.getAttribute("name");
    // String pfp = googleUser.getAttribute("picture");      LATER USES

    User user = userRepository.findByEmail(email)
                            .orElseGet(() -> {
                                User newuser = User.builder()
                                .email(email)
                                .username(name)
                                .userUUID(UUID.randomUUID())
                                .totalVote((long) 0)
                                .createdAt(Instant.now())
                                .authProvider(AuthProvider.GOOGLE)
                                .build();
                                return userRepository.save(newuser);
    });
    String accesstoken = jwtService.generateToken(user);
    var refreshToken = refreshTokenService.createRefreshToken(user, request);
    // 3. Redirect back to Frontent
    // For local testing: http://localhost:5173/auth/callback?token=%s&refreshToken=%s
    // For production: https://xhdh-wine.vercel.app/auth/callback?token=%s&refreshToken=%s
    String targetUrl = String.format(
    "https://xhdh-wine.vercel.app/auth/callback?token=%s&refreshToken=%s", 
    accesstoken, 
    refreshToken.getToken()
);
    getRedirectStrategy().sendRedirect(request, response, targetUrl);         
    }
}