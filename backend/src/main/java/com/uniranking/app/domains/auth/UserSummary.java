package com.uniranking.app.domains.auth;

public interface UserSummary {
    long getId();
    String getEmail();
    String getUsername();
    AuthProvider getAuthProvider();
}
