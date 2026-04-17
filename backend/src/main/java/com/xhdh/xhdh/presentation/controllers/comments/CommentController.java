package com.xhdh.xhdh.presentation.controllers.comments;

import com.xhdh.xhdh.application.dto.comments.CommentRequest;
import com.xhdh.xhdh.application.dto.comments.CommentResponse;
import com.xhdh.xhdh.application.services.CommentService;
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
@RequestMapping(path = "api/matches")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping(path = "/{matchId}/comments")
    public ResponseEntity<Page<CommentResponse>> getTopLevelComments(
            @PathVariable Long matchId,
            @Parameter(hidden = true)
            @PageableDefault(size = 20, sort = "commentDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
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

    @PatchMapping("/comments/{id}/likes")
    public void updateLikes(@RequestParam Long id) {
        commentService.updateLike(id);
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long id, @RequestParam String newContent) {
        CommentResponse newComment = commentService.updateComment(id, newContent);
        return new ResponseEntity<>(newComment, HttpStatus.OK);
    }

    @DeleteMapping("/comments/{id}")
    public String deleteComment(@PathVariable Long id) {
        return commentService.deleteComment(id);
    }
}
