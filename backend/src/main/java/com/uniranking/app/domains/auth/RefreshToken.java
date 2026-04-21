package com.uniranking.app.domains.auth;

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