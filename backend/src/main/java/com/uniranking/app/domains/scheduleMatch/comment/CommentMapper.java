package com.uniranking.app.domains.scheduleMatch.comment;

import com.uniranking.app.domains.user.User;

public interface CommentMapper {
    Comment toComment(CommentRequest commentRequest, User user);
    CommentResponse toCommentResponse(Comment comment);
}
