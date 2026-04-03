package com.xhdh.xhdh.domain.models;

import java.time.Instant;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken{
    private Long userId;
    private String email; 
    private String token;
    private Instant expiryDate;
    private String ipAddress;
    private String userAgent;
}