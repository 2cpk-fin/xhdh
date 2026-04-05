package com.xhdh.xhdh.application.dto.comments;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class CommentResponse {
    private Long id;
    private String username;
    private Long matchId;
    private LocalDateTime commentDate;
    private Long likes;
    private Long parentId;
    private String content;
}
