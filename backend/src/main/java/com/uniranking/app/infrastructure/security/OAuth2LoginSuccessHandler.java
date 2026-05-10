package com.uniranking.app.infrastructure.security;

import java.io.IOException;

import com.uniranking.app.domains.auth.refreshToken.RefreshTokenService;
import com.uniranking.app.domains.user.Role;
import com.uniranking.app.domains.user.UserMapper;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

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

    @Value("${callback.url}")
    private String callbackUrl;

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
                    newuser.setRole(Role.USER);
                    return userRepository.save(newuser);
                });

        String accessToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user, request);
        String targetUrl = String.format(
                callbackUrl,
                accessToken,
                refreshToken.getToken()
        );
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}