package com.uniranking.app.domains.scheduleMatch.comment;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@JsonPropertyOrder({ "id", "publicCommentId", "username", "matchId", "publicMatchId", "commentDate", "likes", "parentId", "publicParentId", "content" })
public class CommentResponse {
    private long id;

    private UUID publicCommentId;

    private String username;

    private long matchId;

    private UUID publicMatchId;

    private LocalDateTime commentDate;

    private Long likes;

    private long parentId;

    private UUID publicParentId;

    private String content;
}
