package com.uniranking.app.infrastructure.exceptions;

public class NotAuthenticated extends RuntimeException {
    public NotAuthenticated(String message) {
        super(message);
    }  
}
