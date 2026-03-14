package com.xhdh.xhdh.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.xhdh.xhdh.dto.AuthRequest;
import com.xhdh.xhdh.dto.AuthResponse;
import com.xhdh.xhdh.repositories.UserRepository;
import com.xhdh.xhdh.security.JwtService;

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
