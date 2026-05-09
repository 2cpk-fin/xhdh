package com.uniranking.app.domains.scheduleMatch.comment;

import com.uniranking.app.domains.auth.exceptions.UserNotFoundException;
import com.uniranking.app.domains.scheduleMatch.exceptions.CommentNotFoundException;
import com.uniranking.app.domains.scheduleMatch.exceptions.UnauthorizedCommentAccessException;
import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final UserRepository userRepository;

    public Page<CommentResponse> getAllComments(long matchId, Pageable pageable) {
        return commentRepository.findByMatch(matchId, pageable).map(commentMapper::toCommentResponse);
    }

    @Override
    @Transactional
    public CommentResponse createComment(CommentRequest commentRequest, Authentication authentication) {
        // Get the user first
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Save their comments
        Comment comment = commentMapper.toComment(commentRequest, currentUser);
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toCommentResponse(savedComment);
    }

    @Override
    @Transactional
    public CommentResponse updateComment(Long id, String newContent, Authentication authentication) {
        Comment comment = findById(id, authentication);
        comment.setContent(newContent);
        return commentMapper.toCommentResponse(commentRepository.save(comment));
    }

    @Override
    @Transactional
    public String deleteComment(Long id, Authentication authentication) {
        Comment comment = findById(id, authentication);
        commentRepository.delete(comment);
        return "Comment with id " + id + " has been deleted";
    }

    private Comment findById(Long id, Authentication authentication) {
        Comment comment =  commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException("Comment is not found"));

        if (!comment.getUser().getEmail().equals(authentication.getName())) {
            throw new UnauthorizedCommentAccessException("You do not have permission to delete this comment");
        }

        return comment;
    }
}