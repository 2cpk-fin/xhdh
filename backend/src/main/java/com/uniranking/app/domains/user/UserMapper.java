package com.uniranking.app.domains.user;

import com.uniranking.app.domains.auth.AuthProvider;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.time.Instant;
import java.util.UUID;

@Mapper(componentModel = "spring", imports = { UUID.class, Instant.class, AuthProvider.class })
public abstract class UserMapper {
    public UserResponse userToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setPublicUserId(user.getPublicUserId());
        response.setEmail(user.getEmail());
        response.setUsername(user.getDisplayUsername());

        if (user.getProfileImage() != null) {
            response.setProfileImage(user.getProfileImage());
        }

        return response;
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