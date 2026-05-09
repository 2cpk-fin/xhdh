package com.uniranking.app.domains.scheduleMatch.comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

public interface CommentService {
    Page<CommentResponse> getAllComments(long matchId, Pageable pageable);

    CommentResponse createComment(CommentRequest commentRequest, Authentication authentication);

    CommentResponse updateComment(Long id, String newContent, Authentication authentication);

    String deleteComment(Long id, Authentication authentication);
}