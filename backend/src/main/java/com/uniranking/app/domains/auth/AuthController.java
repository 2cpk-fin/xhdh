package com.uniranking.app.domains.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(authService.register(registerRequest, httpRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginRequest(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(authService.login(loginRequest, httpRequest));
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logoutRequest(@RequestBody LogoutRequest logoutRequest) {
        return ResponseEntity.ok(authService.logout(logoutRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> body, HttpServletRequest httpRequest) {
        String token = body.get("refreshToken");
        return ResponseEntity.ok(authService.refreshToken(token, httpRequest));
    }
}

