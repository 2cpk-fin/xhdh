package com.xhdh.xhdh.application.dto.authentication;

import lombok.*;

@Getter
@Setter
public class LogoutRequest {
    String accessToken;
    String refreshToken;
}
