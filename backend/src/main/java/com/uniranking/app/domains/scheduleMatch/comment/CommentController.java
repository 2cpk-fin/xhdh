package com.uniranking.app.domains.scheduleMatch.comment;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/schedule/match/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @Operation(summary = "Get all the comments in a specific match")
    @Parameters({
            @Parameter(name = "page", description = "Page number", example = "0"),
            @Parameter(name = "size", description = "Items per page", example = "20"),
            @Parameter(name = "sort", description = "Sorting criteria", example = "commentDate,desc"),
    })
    @GetMapping(path = "/{matchId}")
    public ResponseEntity<Page<CommentResponse>> getAllComments(
            @PathVariable Long matchId,
            @Parameter(hidden = true) @PageableDefault(size = 20, sort = "commentDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return new ResponseEntity<>(commentService.getAllComments(matchId, pageable), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createComment(
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be logged in to vote");
        }

        try {
            CommentResponse newComment = commentService.createComment(request, authentication);
            return new ResponseEntity<>(newComment, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
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