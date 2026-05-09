package com.uniranking.app.domains.auth.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(max = 255, message = "Email too long!")
    private String username;

    @Email(message = "Invalid email format") 
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email too long!")
    private String email;

    @Size(min = 8, message= "Password must be at least 8 characters")
    @Size(max = 20, message = "Too long")
    @NotBlank(message = "Password is required")
    private String password;
}