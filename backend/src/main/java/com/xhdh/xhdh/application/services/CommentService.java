package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.application.dto.comments.CommentRequest;
import com.xhdh.xhdh.application.dto.comments.CommentResponse;
import com.xhdh.xhdh.domain.models.Comment;
import com.xhdh.xhdh.infrastructure.repositories.jpa.CommentRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.MatchRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    private final UserRepository userRepository;

    private final MatchRepository matchRepository;

    private Comment buildComment(CommentRequest commentRequest) {
        return Comment.builder()
                .user(userRepository.getUserById(commentRequest.getUserId()))
                .match(matchRepository.getMatchById(commentRequest.getMatchId()))
                .commentDate(LocalDateTime.from(Instant.now()))
                .parent(commentRepository.findByParentId(commentRequest.getParentId()))
                .children(new ArrayList<>())
                .content(commentRequest.getContent())
                .build();
    }

    private CommentResponse buildCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .username(comment.getUser().getUsername())
                .matchId(comment.getMatch().getId())
                .commentDate(comment.getCommentDate())
                .likes(comment.getLikes())
                .parentId(comment.getParent().getId())
                .content(comment.getContent())
                .build();
    }

    public Page<CommentResponse> getTopLevelComments(Long matchId, Pageable pageable) {
        return commentRepository.findAllTopComments(matchId, pageable)
                .map(this::buildCommentResponse);
    }

    public List<CommentResponse> getReplies(Long parentId) {
        return commentRepository.findByAllSubcommentsByParentId(parentId).stream()
                .map(this::buildCommentResponse)
                .toList();
    }

    public CommentResponse createComment(CommentRequest commentRequest) {
        Comment comment = buildComment(commentRequest);
        Comment savedComment = commentRepository.save(comment);
        return buildCommentResponse(savedComment);
    }

    public CommentResponse updateComment(Long id, String newContent) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setContent(newContent);
        commentRepository.save(comment);
        return buildCommentResponse(comment);
    }

    public String deleteComment(Long id) {
        commentRepository.deleteById(id);
        return "Comment with id " + id + " has been deleted";
    }
}
