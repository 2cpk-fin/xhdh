package com.uniranking.app.infrastructure.exceptions;

public class ScrapingTimeoutException extends ScrapingException {
    public ScrapingTimeoutException(String message) {
        super(message);
    }
}
