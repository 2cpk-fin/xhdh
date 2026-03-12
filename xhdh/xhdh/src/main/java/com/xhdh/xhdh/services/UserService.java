package com.xhdh.xhdh.services;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.xhdh.xhdh.dto.RegisterRequest;
import com.xhdh.xhdh.models.User;
import com.xhdh.xhdh.repositories.UserRepository;
import com.xhdh.xhdh.exceptions.EmailAlreadyExistsException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public ResponseEntity<String> handleRegistration(RegisterRequest request){
        if(userRepository.existsByEmail(request.email())){
            throw new EmailAlreadyExistsException("This email is already taken by someone else");
        }
        String hashedpassword = passwordEncoder.encode(request.password());
        User user = User.builder() /*open builder constructor*/
                    .username(request.username())
                    .password(hashedpassword)
                    .email(request.email())
                    .createdAt(LocalDateTime.now())
                    .build(); /*activate the construction*/
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }

}
