package com.uniranking.app.domains.auth.auth;

import com.uniranking.app.domains.auth.exceptions.UserNotFoundException;
import com.uniranking.app.domains.auth.refreshToken.RefreshToken;
import com.uniranking.app.domains.auth.refreshToken.RefreshTokenService;
import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserMapper;
import com.uniranking.app.domains.auth.exceptions.ExistedEmailException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.uniranking.app.domains.user.UserRepository;
import com.uniranking.app.infrastructure.security.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public AuthResponse register(RegisterRequest registerRequest, HttpServletRequest httpRequest) {
        // Check if the email is already existed
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ExistedEmailException("This email is already taken by someone else");
        }

        // Create new user
        User user = userMapper.registerRequestToUser(registerRequest);
        User savedUser = userRepository.save(user);

        // Provide JWT and refresh token for them
        String jwtToken = jwtService.generateToken(savedUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser, httpRequest);

        // Return the Response
        return toAuthResponse(savedUser, jwtToken, refreshToken);
    }

    // Handle user login
    public AuthResponse login(LoginRequest loginRequest, HttpServletRequest httpRequest){
        // Boilerplate for finding user
        // In short, you give your email and password to this guy, and he'll check the database to verify you
        // If something wrong, it will throw BadCredential exception
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        User user = (User) authentication.getPrincipal();

        String jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user, httpRequest);

        return toAuthResponse(user, jwtToken, refreshToken);
    }

    public AuthResponse refreshToken(String token, HttpServletRequest httpRequest){
        // Check if it's old or fake, it'll throw an error
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(token);

        // Check if the IP is correct or the Agent
        refreshTokenService.verifyMetaData(refreshToken, httpRequest);

        // Find the user via the refresh token
        User user = userRepository.findByEmail(refreshToken.getEmail())
                                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Give them a new JWt
        String newJwt = jwtService.generateToken(user);

        // Delete the old refresh token for security
        refreshTokenService.deleteRefreshToken(token);

        // After deletion, a new refresh token mush be created
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user, httpRequest);

        // Return the Response
        return toAuthResponse(user, newJwt, newRefreshToken);
    }

    public LogoutResponse logout(LogoutRequest request){
        // Basically, when you log out, the server will delete both the JWT and the refresh token
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