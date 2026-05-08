package com.uniranking.app.domains.news.exceptions;

public class SiteUnavailableException extends ScrapingException {
    public SiteUnavailableException(String message) {
        super(message);
    }
}
