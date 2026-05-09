package com.uniranking.app.domains.scheduleMatch.comment;

import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatch;
import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatchRepository;
import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserMapper;
// Import the custom exceptions
import com.uniranking.app.domains.scheduleMatch.exceptions.MatchNotFoundException;
import com.uniranking.app.domains.scheduleMatch.exceptions.CommentNotFoundException;
import com.uniranking.app.domains.scheduleMatch.exceptions.MaxCommentDepthExceededException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CommentMapperImpl implements CommentMapper {
    @Autowired
    private ScheduleMatchRepository scheduleMatchRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserMapper userMapper;

    public Comment toComment(CommentRequest request, User authenticatedUser) {
        if (request == null) return null;

        ScheduleMatch match = scheduleMatchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new MatchNotFoundException("Match not found with ID: " + request.getMatchId()));

        Comment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new CommentNotFoundException("Parent comment not found with ID: " + request.getParentId()));

            if (parent.getParent() != null) {
                throw new MaxCommentDepthExceededException("Replies can only be one level deep.");
            }
        }

        return Comment.builder()
                .content(request.getContent())
                .user(authenticatedUser)
                .commentDate(LocalDateTime.now())
                .scheduleMatch(match)
                .parent(parent)
                .build();
    }

    public CommentResponse toCommentResponse(Comment comment) {
        if (comment == null) return null;

        CommentResponse commentResponse = CommentResponse.builder()
                .id(comment.getId())
                .publicCommentId(comment.getPublicCommentId())
                .commentDate(comment.getCommentDate())
                .content(comment.getContent())
                .user(userMapper.userToResponse(comment.getUser()))
                .build();


        if (comment.getParent() != null) {
            commentResponse.setParent(toCommentResponse(comment.getParent()));
        }

        return commentResponse;
    }
}