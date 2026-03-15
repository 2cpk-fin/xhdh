package com.xhdh.xhdh.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.xhdh.xhdh.dto.AuthRequest;
import com.xhdh.xhdh.dto.AuthResponse;
import com.xhdh.xhdh.services.AuthService;

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

}
