package com.uniranking.app.domains.scheduleMatch.comment;

import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatch;
import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatchRepository;
import com.uniranking.app.domains.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CommentMapper {
    @Autowired
    private ScheduleMatchRepository scheduleMatchRepository;

    @Autowired
    private CommentRepository commentRepository;

    public Comment toComment(CommentRequest request, User authenticatedUser) {
        if (request == null) return null;

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(authenticatedUser);
        comment.setCommentDate(LocalDateTime.now());

        // Resolve Match
        ScheduleMatch match = scheduleMatchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));
        comment.setScheduleMatch(match);

        // Parent-Child Logic
        if (request.getParentId() != null) {
            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parent);
        }

        return comment;
    }

    public CommentResponse toCommentResponse(Comment comment) {
        if (comment == null) return null;

        CommentResponse response = new CommentResponse();

        response.setId(comment.getId());
        response.setPublicCommentId(comment.getPublicCommentId());
        response.setCommentDate(comment.getCommentDate());
        response.setContent(comment.getContent());

        if (comment.getUser() != null) {
            response.setUsername(comment.getUser().getDisplayUsername());
        }

        // Recursive call to map the parent using the same logic
        if (comment.getParent() != null) {
            response.setParent(toCommentResponse(comment.getParent()));
        }

        return response;
    }
}