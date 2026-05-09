package com.uniranking.app.scheduleMatch.comments;

import com.uniranking.app.domains.auth.exceptions.UserNotFoundException;
import com.uniranking.app.domains.scheduleMatch.comment.*;
import com.uniranking.app.domains.scheduleMatch.exceptions.CommentNotFoundException;
import com.uniranking.app.domains.scheduleMatch.exceptions.UnauthorizedCommentAccessException;
import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTests {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private CommentMapper commentMapper;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommentServiceImpl commentServiceImpl;

    private Authentication authentication;
    private User testUser;
    private Comment testComment;
    private CommentResponse testCommentResponse;
    private final String TEST_EMAIL = "test@example.com";

    @BeforeEach
    void setUp() {
        authentication = new UsernamePasswordAuthenticationToken(TEST_EMAIL, null);

        testUser = new User();
        testUser.setEmail(TEST_EMAIL);

        testComment = Comment.builder()
                .id(1L)
                .user(testUser)
                .content("Old Content")
                .commentDate(LocalDateTime.now())
                .build();

        testCommentResponse = CommentResponse.builder()
                .id(1L)
                .content("Old Content")
                .build();
    }

    @Test
    void getAllComments_ReturnsPageOfCommentResponses() {
        long matchId = 100L;
        Pageable pageable = PageRequest.of(0, 10);
        Page<Comment> commentPage = new PageImpl<>(List.of(testComment));

        when(commentRepository.findByMatch(matchId, pageable)).thenReturn(commentPage);
        when(commentMapper.toCommentResponse(testComment)).thenReturn(testCommentResponse);

        Page<CommentResponse> result = commentServiceImpl.getAllComments(matchId, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Old Content", result.getContent().get(0).getContent());
        verify(commentRepository).findByMatch(matchId, pageable);
    }

    @Test
    void createComment_Success() {
        CommentRequest request = new CommentRequest();
        request.setMatchId(100L);
        request.setContent("New Comment");

        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
        when(commentMapper.toComment(request, testUser)).thenReturn(testComment);
        when(commentRepository.save(testComment)).thenReturn(testComment);
        when(commentMapper.toCommentResponse(testComment)).thenReturn(testCommentResponse);

        CommentResponse result = commentServiceImpl.createComment(request, authentication);

        assertNotNull(result);
        verify(userRepository).findByEmail(TEST_EMAIL);
        verify(commentRepository).save(testComment);
    }

    @Test
    void createComment_ThrowsUserNotFoundException() {
        CommentRequest request = new CommentRequest();
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> commentServiceImpl.createComment(request, authentication));
        verify(commentRepository, never()).save(any());
    }

    @Test
    void updateComment_Success() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(testComment));
        when(commentRepository.save(testComment)).thenReturn(testComment);
        when(commentMapper.toCommentResponse(testComment)).thenReturn(testCommentResponse);

        CommentResponse result = commentServiceImpl.updateComment(1L, "Updated Content", authentication);

        assertNotNull(result);
        assertEquals("Updated Content", testComment.getContent()); // Testing the state change
        verify(commentRepository).save(testComment);
    }

    @Test
    void updateComment_ThrowsUnauthorized_WhenUserDoesNotMatch() {
        Authentication otherAuth = new UsernamePasswordAuthenticationToken("otheruser@example.com", null);
        when(commentRepository.findById(1L)).thenReturn(Optional.of(testComment));

        assertThrows(UnauthorizedCommentAccessException.class,
                () -> commentServiceImpl.updateComment(1L, "Updated Content", otherAuth));
        verify(commentRepository, never()).save(any());
    }

    @Test
    void deleteComment_Success() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(testComment));

        String result = commentServiceImpl.deleteComment(1L, authentication);

        assertEquals("Comment with id 1 has been deleted", result);
        verify(commentRepository).delete(testComment);
    }

    @Test
    void deleteComment_ThrowsCommentNotFoundException() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CommentNotFoundException.class, () -> commentServiceImpl.deleteComment(1L, authentication));
        verify(commentRepository, never()).delete(any());
    }
}