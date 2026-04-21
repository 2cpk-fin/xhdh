package com.uniranking.app.domains.scheduleMatch.comment;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@JsonPropertyOrder({"id", "username", "matchId", "commentDate", "likes", "parentId", "content"})
public class CommentResponse {
    private UUID id;

    private String username;

    private UUID matchId;

    private LocalDateTime commentDate;

    private Long likes;

    private UUID parentId;

    private String content;
}
