package com.uniranking.app.domains.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginRequest(@Valid @RequestBody AuthRequest request, HttpServletRequest httpRequest){
        return ResponseEntity.ok(authService.authenticate(request,httpRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody String refreshToken, HttpServletRequest httpRequest){
        return ResponseEntity.ok(authService.refreshToken(refreshToken,httpRequest));
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logoutRequest(@RequestBody LogoutRequest logoutRequest){
        return ResponseEntity.ok(authService.logout(logoutRequest));
    }
}
