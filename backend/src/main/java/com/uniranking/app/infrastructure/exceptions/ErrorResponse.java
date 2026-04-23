package com.uniranking.app.infrastructure.exceptions;

import java.time.Instant;

public record ErrorResponse(
    Instant timestamp,
    int status,
    String error,
    String message,
    String path
    /*
    {
        "timestamp" : *time*,
        "status" : 400,
        "error" : "Conflict",
        "message" : "This is the explanation of error",
        "path" : "/api/users/register"
    }
    */
) {   
}
