package com.xhdh.xhdh.presentation.controllers.authentication;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xhdh.xhdh.application.dto.authentication.RegisterRequest;
import com.xhdh.xhdh.application.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserRegistrationController {
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<String> userRegistering(@Valid @RequestBody RegisterRequest request){
        return userService.handleRegistration(request);
    }
}
