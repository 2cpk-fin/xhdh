package com.uniranking.app.domains.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.uniranking.app.domains.user.UserRepository;
import com.uniranking.app.infrastructure.security.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse authenticate(AuthRequest request,HttpServletRequest httpRequest){
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(),request.password())
        );
        var user = userRepository.findByEmail(request.email())
                    .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));
        
        var jwtToken = jwtService.generateToken(user);

        var refreshToken = refreshTokenService.createRefreshToken(user, httpRequest);

        return new AuthResponse(jwtToken, refreshToken.getToken());
    }

    public AuthResponse refreshToken(String token, HttpServletRequest httpRequest){
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(token);
        refreshTokenService.verifyMetaData(refreshToken, httpRequest);

        var user = userRepository.findByPublicUserId(refreshToken.getUserUUID())
                                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String newJwt = jwtService.generateToken(user);
        refreshTokenService.deleteRefreshToken(token);
        var newRefreshToken = refreshTokenService.createRefreshToken(user, httpRequest);
        return new AuthResponse(newJwt, newRefreshToken.getToken());
          
    }

    public LogoutResponse logout(LogoutRequest request){
        refreshTokenService.deleteRefreshToken(request.getRefreshToken());
        if (request.getAccessToken() != null) {
            refreshTokenService.blackListAccessToken(request.getAccessToken());
        }
        return new LogoutResponse("Logout successful");
    }
}
