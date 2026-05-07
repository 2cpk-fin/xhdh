package com.uniranking.app.domains.scheduleMatch.comment;

import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final UserRepository userRepository;

    public Page<CommentResponse> getAllComments(long matchId, Pageable pageable) {
        return commentRepository.findByMatch(matchId, pageable).map(commentMapper::toCommentResponse);
    }

    @Transactional
    public CommentResponse createComment(CommentRequest commentRequest, Authentication authentication) {
        // Get the user first
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Save their comments
        Comment comment = commentMapper.toComment(commentRequest, currentUser);
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toCommentResponse(savedComment);
    }

    @Transactional
    public CommentResponse updateComment(Long id, String newContent, Authentication authentication) {
        Comment comment = findById(id, authentication);
        comment.setContent(newContent);
        return commentMapper.toCommentResponse(commentRepository.save(comment));
    }

    @Transactional
    public String deleteComment(Long id, Authentication authentication) {
        Comment comment = findById(id, authentication);
        commentRepository.delete(comment);
        return "Comment with id " + id + " has been deleted";
    }

    private Comment findById(Long id, Authentication authentication) {
        Comment comment =  commentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment is not found"));

        if (!comment.getUser().getEmail().equals(authentication.getName())) {
            throw new AccessDeniedException("You do not have permission to delete this comment");
        }

        return comment;
    }
}