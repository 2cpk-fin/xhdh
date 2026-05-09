package com.uniranking.app.domains.user;

import com.uniranking.app.domains.auth.auth.AuthProvider;
import com.uniranking.app.domains.auth.auth.RegisterRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.Instant;
import java.util.UUID;

@Mapper(componentModel = "spring", imports = { UUID.class, Instant.class, AuthProvider.class })
public interface UserMapper {

    @Mapping(target = "password", source = "encodedPassword")
    @Mapping(target = "publicUserId", expression = "java(UUID.randomUUID())")
    @Mapping(target = "createdAt", expression = "java(Instant.now())")
    User registerRequestToUser(RegisterRequest registerRequest, String encodedPassword);

    @Mapping(target = "username", source = "displayUsername")
    UserResponse userToResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "publicUserId", expression = "java(UUID.randomUUID())")
    @Mapping(target = "createdAt", expression = "java(Instant.now())")
    @Mapping(target = "authProvider", expression = "java(AuthProvider.GOOGLE)")
    @Mapping(target = "username", source = "name")
    @Mapping(target = "profileImage", source = "pfp")
    User oAuthToUser(String email, String name, String pfp);
}