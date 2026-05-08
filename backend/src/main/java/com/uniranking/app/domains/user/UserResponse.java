package com.uniranking.app.domains.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class UserResponse {
    private long id;
    private UUID publicUserId;
    private String username;
    private String email;
    private String profileImage;
}
