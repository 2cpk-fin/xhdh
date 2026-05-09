package com.uniranking.app.domains.soloMatch.exceptions;

public class SoloMatchExpiredException extends RuntimeException {
    public SoloMatchExpiredException(String message) {
        super(message);
    }
}
