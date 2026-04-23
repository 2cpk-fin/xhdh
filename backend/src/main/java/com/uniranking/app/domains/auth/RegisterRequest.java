package com.uniranking.app.domains.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email format") 
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min = 8, message= "Password must be at least 8 characters")
    @Size(max = 20, message = "Too long")
    @NotBlank(message = "Password is required")
    private String password;
}