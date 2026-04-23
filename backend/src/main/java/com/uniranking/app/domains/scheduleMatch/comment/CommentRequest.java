package com.uniranking.app.domains.scheduleMatch.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Match ID is required")
    private Long matchId;

    private Long parentId;

    @NotBlank(message = "The content cannot be empty")
    @Size(max = 4500, message = "Too long!")
    private String content;
}
