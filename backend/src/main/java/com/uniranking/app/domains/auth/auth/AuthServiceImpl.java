package com.uniranking.app.domains.auth.auth;

import com.uniranking.app.domains.auth.exceptions.UserNotFoundException;
import com.uniranking.app.domains.auth.refreshToken.RefreshToken;
import com.uniranking.app.domains.auth.refreshToken.RefreshTokenService;
import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserMapper;
import com.uniranking.app.domains.auth.exceptions.ExistedEmailException;
import com.uniranking.app.infrastructure.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uniranking.app.domains.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest registerRequest, HttpServletRequest httpRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ExistedEmailException("This email is already taken by someone else");
        }
        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
        User user = userMapper.registerRequestToUser(registerRequest, encodedPassword);
        User savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(savedUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser, httpRequest);
        return toAuthResponse(savedUser, jwtToken, refreshToken);
    }

    public AuthResponse login(LoginRequest loginRequest, HttpServletRequest httpRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        User user = (User) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user, httpRequest);
        return toAuthResponse(user, jwtToken, refreshToken);
    }

    public AuthResponse refreshToken(String token, HttpServletRequest httpRequest) {
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(token);
        refreshTokenService.verifyMetaData(refreshToken, httpRequest);
        User user = userRepository.findByEmail(refreshToken.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        String newJwt = jwtService.generateToken(user);
        refreshTokenService.deleteRefreshToken(token);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user, httpRequest);
        return toAuthResponse(user, newJwt, newRefreshToken);
    }

    public LogoutResponse logout(LogoutRequest request) {
        refreshTokenService.deleteRefreshToken(request.getRefreshToken());
        if (request.getAccessToken() != null) {
            refreshTokenService.blackListAccessToken(request.getAccessToken());
        }
        return new LogoutResponse("Logout successful");
    }

    private AuthResponse toAuthResponse(User user, String jwt, RefreshToken refreshToken) {
        return AuthResponse.builder()
                .username(user.getDisplayUsername())
                .email(user.getEmail())
                .token(jwt)
                .refreshToken(refreshToken.getToken())
                .build();
    }
}