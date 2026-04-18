package com.xhdh.xhdh.domain.models.authentication;

import java.time.Instant;
import java.util.UUID;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken{
    private UUID userUUID;
    private String email; 
    private String token;
    private Instant expiryDate;
    private String ipAddress;
    private String userAgent;
}