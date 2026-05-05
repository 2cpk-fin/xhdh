package com.uniranking.app.domains.scheduleMatch.comment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.uniranking.app.domains.user.UserResponse;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@JsonPropertyOrder({ "id", "publicCommentId", "user", "commentDate", "parent", "content" })
public class CommentResponse {
    private Long id;
    private UUID publicCommentId;
    private UserResponse user;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime commentDate;

    private CommentResponse parent;
    private String content;
}