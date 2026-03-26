package com.xhdh.xhdh.application.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.xhdh.xhdh.application.dto.authentication.AuthRequest;
import com.xhdh.xhdh.application.dto.authentication.AuthResponse;
import com.xhdh.xhdh.infrastructure.repositories.UserRepository;
import com.xhdh.xhdh.infrastructure.security.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse authenticate(AuthRequest request){
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(),request.password())
        );
        var user = userRepository.findByEmail(request.email())
                    .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));
        var jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }
    
    
}
