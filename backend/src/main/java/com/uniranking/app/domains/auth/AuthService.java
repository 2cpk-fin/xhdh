package com.uniranking.app.domains.auth;

import com.uniranking.app.domains.user.User;
import com.uniranking.app.infrastructure.exceptions.EmailAlreadyExistsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uniranking.app.domains.user.UserRepository;
import com.uniranking.app.infrastructure.security.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest registerRequest, HttpServletRequest httpRequest) {
        // Check if the email is already existed
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyExistsException("This email is already taken by someone else");
       }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPublicUserId(UUID.randomUUID());
        user.setCreatedAt(Instant.now());

        User savedUser = userRepository.save(user);

        // Provide JWT and refresh token for them
        String jwtToken = jwtService.generateToken(savedUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser, httpRequest);

        // Return the Response
        AuthResponse authResponse = new AuthResponse();
        authResponse.setUsername(savedUser.getUsername());
        authResponse.setEmail(savedUser.getEmail());
        authResponse.setToken(jwtToken);
        authResponse.setRefreshToken(refreshToken.getToken());

        return authResponse;
    }

    // Handle user login
    public AuthResponse login(LoginRequest loginRequest, HttpServletRequest httpRequest){
        // Boilerplate for finding user
        // In short, you give your email and password to this guy, and he'll check the database to verify you
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        // Ok, so you pass the test, now you can assign as a user
        // We'll provide a JWT token for ya
        User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));

        // JWT Token is provided for you here!
        String jwtToken = jwtService.generateToken(user);

        // We also provide you this refreshToken
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user, httpRequest);

        // Return the Response
        AuthResponse authResponse = new AuthResponse();
        authResponse.setUsername(user.getUsername());
        authResponse.setEmail(user.getEmail());
        authResponse.setToken(jwtToken);
        authResponse.setRefreshToken(refreshToken.getToken());

        return authResponse;
    }

    public AuthResponse refreshToken(String token, HttpServletRequest httpRequest){
        // Check if it's old or fake, it'll throw an error
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(token);

        // Check if the IP is correct or the Agent
        refreshTokenService.verifyMetaData(refreshToken, httpRequest);

        // Find the user via the refresh token
        User user = userRepository.findByPublicUserId(refreshToken.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

        // Give them a new JWt
        String newJwt = jwtService.generateToken(user);

        // Delete the old refresh token for security
        refreshTokenService.deleteRefreshToken(token);

        // After deletion, a new refresh token mush be created
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user, httpRequest);

        // Return the Response
        AuthResponse authResponse = new AuthResponse();
        authResponse.setUsername(user.getUsername());
        authResponse.setEmail(user.getEmail());
        authResponse.setToken(newJwt);
        authResponse.setRefreshToken(newRefreshToken.getToken());

        return authResponse;
          
    }

    public LogoutResponse logout(LogoutRequest request){
        // Basically, when you log out, the server will delete both the JWT and the refresh token
        refreshTokenService.deleteRefreshToken(request.getRefreshToken());
        if (request.getAccessToken() != null) {
            refreshTokenService.blackListAccessToken(request.getAccessToken());
        }
        return new LogoutResponse("Logout successful");
    }
}