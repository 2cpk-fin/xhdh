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
        return ResponseEntity.ok(commentService.getAllComments(matchId, pageable));
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        return new ResponseEntity<>(commentService.createComment(request, authentication), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentUpdateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(commentService.updateComment(id, request.getContent(), authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(commentService.deleteComment(id, authentication));
    }
}