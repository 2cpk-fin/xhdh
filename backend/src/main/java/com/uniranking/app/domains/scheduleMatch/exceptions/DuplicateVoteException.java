package com.uniranking.app.domains.scheduleMatch.exceptions;

public class DuplicateVoteException extends RuntimeException {
    public DuplicateVoteException(String message) {
        super(message);
    }
}
