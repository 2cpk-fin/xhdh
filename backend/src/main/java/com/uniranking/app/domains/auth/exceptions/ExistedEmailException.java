package com.uniranking.app.domains.auth.exceptions;

public class ExistedEmailException extends RuntimeException {
    public ExistedEmailException(String message){
        super(message);
    }
}
