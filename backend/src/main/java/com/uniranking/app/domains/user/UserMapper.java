package com.uniranking.app.domains.user;

import com.uniranking.app.domains.auth.auth.AuthProvider;
import com.uniranking.app.domains.auth.auth.RegisterRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.UUID;

@Mapper(componentModel = "spring", imports = { UUID.class, Instant.class, AuthProvider.class })
public abstract class UserMapper {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerRequestToUser(RegisterRequest registerRequest) {
        return User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .publicUserId(UUID.randomUUID())
                .createdAt(Instant.now())
                .build();
    }

    public UserResponse userToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .publicUserId(user.getPublicUserId())
                .email(user.getEmail())
                .username(user.getDisplayUsername())
                .profileImage(user.getProfileImage())
                .build();
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "publicUserId", expression = "java(UUID.randomUUID())")
    @Mapping(target = "createdAt", expression = "java(Instant.now())")
    @Mapping(target = "authProvider", expression = "java(AuthProvider.GOOGLE)")
    @Mapping(target = "username", source = "name")
    @Mapping(target = "profileImage", source = "pfp")
    public abstract User oAuthToUser(String email, String name, String pfp);
}