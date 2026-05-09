package com.uniranking.app.domains.scheduleMatch.exceptions;

public class UnauthorizedCommentAccessException extends RuntimeException {
    public UnauthorizedCommentAccessException(String message) {
        super(message);
    }
}
