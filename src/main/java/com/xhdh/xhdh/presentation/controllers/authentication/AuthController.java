package com.xhdh.xhdh.presentation.controllers.authentication;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.xhdh.xhdh.application.dto.AuthRequest;
import com.xhdh.xhdh.application.dto.AuthResponse;
import com.xhdh.xhdh.application.services.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginRequest(@Valid @RequestBody AuthRequest request){
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken){
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logoutRequest(){
        authService.logout();
        return ResponseEntity.ok().build();
    }
}
