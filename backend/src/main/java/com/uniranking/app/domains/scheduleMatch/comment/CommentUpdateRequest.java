package com.uniranking.app.domains.scheduleMatch.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentUpdateRequest {

    @NotBlank(message = "The content cannot be empty")
    @Size(max = 4500, message = "Too long! Max limit is roughly 750 words.")
    private String content;

}