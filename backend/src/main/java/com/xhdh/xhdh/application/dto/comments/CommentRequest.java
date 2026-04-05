package com.xhdh.xhdh.application.dto.comments;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    private Long userId;
    private Long matchId;
    private Long parentId;
    private String content;
}
