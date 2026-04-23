package com.uniranking.app.infrastructure.security;

import java.io.IOException;

import com.uniranking.app.domains.user.UserMapper;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.uniranking.app.domains.auth.RefreshTokenService;
import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler{
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Override
    public void onAuthenticationSuccess(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            Authentication authentication
    ) throws IOException{
        OAuth2User googleUser = (OAuth2User) authentication.getPrincipal();
        assert googleUser != null;
        String email = googleUser.getAttribute("email");
        String name = googleUser.getAttribute("name");
        String pfp = googleUser.getAttribute("picture");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newuser = userMapper.oAuthToUser(email, name, pfp);
                    return userRepository.save(newuser);
                });

        String accessToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user, request);
        // Redirect back to Frontend
        // For local testing: http://localhost:5173/auth/callback?token=%s&refreshToken=%s
        // For production: https://xhdh-wine.vercel.app/auth/callback?token=%s&refreshToken=%s
        String targetUrl = String.format(
                "http://localhost:5173/auth/callback?token=%s&refreshToken=%s",
                accessToken,
                refreshToken.getToken()
        );
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}