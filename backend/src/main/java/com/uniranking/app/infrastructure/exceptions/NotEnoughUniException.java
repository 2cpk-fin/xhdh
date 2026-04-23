package com.uniranking.app.infrastructure.exceptions;

public class NotEnoughUniException extends RuntimeException{
    public NotEnoughUniException(String message){
        super(message);
    }
}
