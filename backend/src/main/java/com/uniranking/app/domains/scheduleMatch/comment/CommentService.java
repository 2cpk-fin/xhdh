package com.uniranking.app.domains.scheduleMatch.comment;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return commentRepository.findAllSubcommentsByParentId(parentId).stream()
                .map(commentMapper::toCommentResponse)
                .toList();
    }

    @Transactional
    public CommentResponse createComment(CommentRequest commentRequest) {
        Comment comment = commentMapper.toComment(commentRequest);
        Comment savedComment = commentRepository.save(comment);

        // Increment replyCount on the parent when this is a reply.
        if (commentRequest.getParentId() != null) {
            commentRepository.incrementReplyCount(commentRequest.getParentId());
        }

        return commentMapper.toCommentResponse(savedComment);
    }

    // Kept @Transactional on the service method and removed it from the repository method,
    // since the transaction should be owned at the service layer.
    // Using Spring's annotation consistently throughout.
    @Transactional
    public void updateLike(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("Comment not found with id: " + id);
        }
        commentRepository.incrementLikes(id);
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
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        // Decrement replyCount on the parent when deleting a reply.
        if (comment.getParent() != null) {
            commentRepository.decrementReplyCount(comment.getParent().getId());
        }

        commentRepository.deleteById(id);
        return "Comment with id " + id + " has been deleted";
    }
}