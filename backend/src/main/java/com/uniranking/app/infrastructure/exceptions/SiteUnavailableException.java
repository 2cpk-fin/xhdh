package com.uniranking.app.infrastructure.exceptions;

public class SiteUnavailableException extends ScrapingException {
    public SiteUnavailableException(String message) {
        super(message);
    }
}
