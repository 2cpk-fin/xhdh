package com.uniranking.app.domains.news.exceptions;

// General
public class ScrapingException extends RuntimeException {
    public ScrapingException(String message) {
        super(message);
    }
}

