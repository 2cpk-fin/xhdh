package com.uniranking.app.domains.scheduleMatch.comment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@JsonPropertyOrder({ "id", "publicCommentId", "username", "commentDate", "likes", "parent", "content", "replyCount" })
public class CommentResponse {
    private Long id;
    private UUID publicCommentId;
    private String username;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime commentDate;

    private Long likes;
    private CommentResponse parent;
    private String content;
    private Long replyCount;
}