package com.uniranking.app.domains.news.exceptions;

public class ScrapingTimeoutException extends ScrapingException {
    public ScrapingTimeoutException(String message) {
        super(message);
    }
}
