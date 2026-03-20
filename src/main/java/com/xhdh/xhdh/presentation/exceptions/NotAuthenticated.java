package com.xhdh.xhdh.presentation.exceptions;

public class NotAuthenticated extends RuntimeException {
    public NotAuthenticated(String message) {
        super(message);
    }  
}
