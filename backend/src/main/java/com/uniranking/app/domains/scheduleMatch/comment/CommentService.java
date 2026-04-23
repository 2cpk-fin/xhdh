package com.uniranking.app.domains.scheduleMatch.comment;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    private final CommentMapper commentMapper;

    public Page<CommentResponse> getTopLevelComments(Long matchId, Pageable pageable) {
        return commentRepository.findAllTopComments(matchId, pageable)
                .map(commentMapper::toCommentResponse);
    }

    public List<CommentResponse> getReplies(Long parentId) {
        return commentRepository.findByAllSubcommentsByParentId(parentId).stream()
                .map(commentMapper::toCommentResponse)
                .toList();
    }

    public CommentResponse createComment(CommentRequest commentRequest) {
        Comment comment = commentMapper.toComment(commentRequest);
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toCommentResponse(savedComment);
    }

    @Transactional
    public void updateLike(Long id) {
        commentRepository.incrementLikes(id);
    }

    public CommentResponse updateComment(Long id, String newContent) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(newContent);
        commentRepository.save(comment);
        return commentMapper.toCommentResponse(comment);
    }

    public String deleteComment(Long id) {
        commentRepository.deleteById(id);
        return "Comment with id " + id + " has been deleted";
    }
}
