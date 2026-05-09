package com.uniranking.app.domains.scheduleMatch.exceptions;

public class InvalidParticipantCountException extends RuntimeException {
    public InvalidParticipantCountException(String message) {
        super(message);
    }
}
