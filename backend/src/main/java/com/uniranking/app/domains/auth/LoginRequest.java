package com.uniranking.app.domains.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email too long!")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password needs at least 8 characters")
    @Size(max = 20, message = "Password too long!")
    private String password;
}