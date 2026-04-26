package com.uniranking.app.domains.scheduleMatch.comment;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/schedule/match/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping(path = "/{matchId}")
    public ResponseEntity<Page<CommentResponse>> getTopLevelComments(
            @PathVariable Long matchId,
            @Parameter(hidden = true) @PageableDefault(size = 20, sort = "commentDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return new ResponseEntity<>(commentService.getTopLevelComments(matchId, pageable), HttpStatus.OK);
    }

    @GetMapping(path = "/{parentId}/replies")
    public ResponseEntity<List<CommentResponse>> getReplies(@PathVariable Long parentId) {
        return new ResponseEntity<>(commentService.getReplies(parentId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CommentRequest request) {
        CommentResponse newComment = commentService.createComment(request);
        return new ResponseEntity<>(newComment, HttpStatus.CREATED);
    }

    // Wrapped in ResponseEntity so 404 is returned when the comment doesn't exist,
    // instead of silently returning 200 with 0 rows updated.
    @PatchMapping("/{id}/likes")
    public ResponseEntity<Void> updateLikes(@PathVariable Long id) {
        commentService.updateLike(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentUpdateRequest request) {
        CommentResponse updated = commentService.updateComment(id, request.getContent());
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public String deleteComment(@PathVariable Long id) {
        return commentService.deleteComment(id);
    }
}