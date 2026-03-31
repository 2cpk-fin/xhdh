package com.xhdh.xhdh.application.services;

import java.time.Instant;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.xhdh.xhdh.application.dto.authentication.RegisterRequest;
import com.xhdh.xhdh.application.dto.authentication.RegistrationResponse;
import com.xhdh.xhdh.domain.models.User;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UserRepository;
import com.xhdh.xhdh.presentation.exceptions.EmailAlreadyExistsException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService{
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public ResponseEntity<RegistrationResponse> handleRegistration(RegisterRequest request){
        if(userRepository.existsByEmail(request.email())){
            throw new EmailAlreadyExistsException("This email is already taken by someone else");
        }
        
        String hashedpassword = passwordEncoder.encode(request.password());
        User user = User.builder() /*open builder constructor*/
                    .username(request.username())
                    .password(hashedpassword)
                    .email(request.email())
                    .createdAt(Instant.now())
                    .totalVote((long) 0)
                    .userUUID(UUID.randomUUID())
                    .build(); /*activate the construction*/
        User savedUser = userRepository.save(user);
        
        RegistrationResponse response = RegistrationResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .message("User registered successfully!")
                .success(true)
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Cannot find this user!"));
    }
}
