package com.xhdh.xhdh.application.dto.comment;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@JsonPropertyOrder({"publicCommentId", "username", "matchId", "commentDate", "likes", "parentId", "content"})
public class CommentResponse {
    private UUID publicCommentId;

    private String username;

    private Long matchId;

    private LocalDateTime commentDate;

    private Long likes;

    private Long parentId;

    private String content;
}
