package com.uniranking.app.domains.soloMatch.exceptions;

public class InsufficientOpponentsException extends RuntimeException {
    public InsufficientOpponentsException(String message) {
        super(message);
    }
}
