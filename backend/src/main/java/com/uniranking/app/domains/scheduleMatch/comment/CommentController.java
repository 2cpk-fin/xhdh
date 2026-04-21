package com.uniranking.app.domains.scheduleMatch.comment;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
@RequestMapping(path = "api/events/match/comments")
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

    @PatchMapping("/{id}/likes")
    public void updateLikes(@PathVariable Long id) {
        commentService.updateLike(id);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @RequestBody
            @NotBlank(message = "The content cannot be empty")
            @Size(max = 4500, message = "Too long! Max limit is roughly 750 words.")
            String newContent) {
        CommentResponse newComment = commentService.updateComment(id, newContent);
        return new ResponseEntity<>(newComment, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public String deleteComment(@PathVariable Long id) {
        return commentService.deleteComment(id);
    }
}
