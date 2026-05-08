package com.uniranking.app.domains.scheduleMatch.exceptions;

public class MaxCommentDepthExceededException extends RuntimeException {
    public MaxCommentDepthExceededException(String message) {
        super(message);
    }
}
