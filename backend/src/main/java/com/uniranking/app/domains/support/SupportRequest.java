package com.uniranking.app.domains.support;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SupportRequest {

    @NotBlank(message = "Support content cannot be empty.")
    @Pattern(
            regexp = "^(\\s*\\S+){1,250}\\s*$",
            message = "Support content must not exceed 250 words to prevent security attacks."
    )
    private String content;
}