package com.uniranking.app.domains.scheduleMatch.exceptions;

public class MatchNotStartedException extends RuntimeException {
    public MatchNotStartedException(String message) {
        super(message);
    }
}
