package com.xhdh.xhdh.application.dto.comments;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    @NotBlank(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "MatchID is required")
    private Long matchId;

    private Long parentId;

    @NotBlank(message = "The content cannot be empty")
    @Size(max = 750, message = "Too long!")
    private String content;
}
