package com.uniranking.app.domains.auth.exceptions;

public class SuspiciousTokenUsageException extends RuntimeException {
    public SuspiciousTokenUsageException(String message) {
        super(message);
    }
}
