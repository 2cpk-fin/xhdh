package com.xhdh.xhdh.presentation.controllers.authentication;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.xhdh.xhdh.application.dto.authentication.AuthRequest;
import com.xhdh.xhdh.application.dto.authentication.AuthResponse;
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

}
