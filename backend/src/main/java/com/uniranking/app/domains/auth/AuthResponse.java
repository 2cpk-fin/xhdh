package com.uniranking.app.domains.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String username;
    private String email;
    private String token;
    private String refreshToken;
}