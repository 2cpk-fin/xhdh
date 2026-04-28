package com.uniranking.app.domains.scheduleMatch.comment;

import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

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
        String email = authentication.getName();
        Optional<User> currentUser = userRepository.findByEmail(email);
        User user;
        if (currentUser.isPresent()) {
            user = currentUser.get();
        }
        else {
            throw new RuntimeException("User not found");
        }

        Comment comment = commentMapper.toComment(commentRequest, user);
        Comment savedComment = commentRepository.save(comment);

        return commentMapper.toCommentResponse(savedComment);
    }

    @Transactional
    public CommentResponse updateComment(Long id, String newContent) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(newContent);
        return commentMapper.toCommentResponse(commentRepository.save(comment));
    }

    @Transactional
    public String deleteComment(Long id) {
        if (commentRepository.findById(id).isEmpty()) {
            throw new RuntimeException("Comment not found");
        }
        commentRepository.deleteById(id);
        return "Comment with id " + id + " has been deleted";
    }
}