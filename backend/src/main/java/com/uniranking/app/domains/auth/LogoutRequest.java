package com.uniranking.app.domains.auth;

import lombok.*;

@Getter
@Setter
public class LogoutRequest {
    String accessToken;
    String refreshToken;
}
