package com.uniranking.app.scheduleMatch.comments;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uniranking.app.common.BaseControllerTest;
import com.uniranking.app.domains.scheduleMatch.comment.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
class CommentControllerTests extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CommentService commentServiceImpl;

    @Autowired
    private ObjectMapper objectMapper;

    private CommentResponse testResponse;

    @BeforeEach
    void setUp() {
        testResponse = CommentResponse.builder()
                .id(1L)
                .content("Test Comment")
                .build();
    }

    @Test
    @WithMockUser
    void getAllComments_ReturnsPage() throws Exception {
        Page<CommentResponse> pageResponse = new PageImpl<>(List.of(testResponse));

        when(commentServiceImpl.getAllComments(anyLong(), any(Pageable.class))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/schedule/match/comments/100")
                        .param("page", "0")
                        .param("size", "20")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].content").value("Test Comment"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void createComment_Success() throws Exception {
        CommentRequest request = new CommentRequest();
        request.setMatchId(100L);
        request.setContent("Test Comment");

        when(commentServiceImpl.createComment(any(), any()))
                .thenReturn(testResponse);

        mockMvc.perform(post("/api/schedule/match/comments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.content").value("Test Comment"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void createComment_FailsValidation_WhenContentIsBlank() throws Exception {
        CommentRequest request = new CommentRequest();
        request.setMatchId(100L);
        request.setContent("");

        mockMvc.perform(post("/api/schedule/match/comments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void updateComment_Success() throws Exception {
        CommentUpdateRequest request = new CommentUpdateRequest();
        request.setContent("Updated Comment");

        CommentResponse updatedResponse = CommentResponse.builder()
                .id(1L)
                .content("Updated Comment")
                .build();

        when(commentServiceImpl.updateComment(any(), any(), any()))
                .thenReturn(updatedResponse);

        mockMvc.perform(patch("/api/schedule/match/comments/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Updated Comment"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void deleteComment_Success() throws Exception {
        String successMessage = "Comment with id 1 has been deleted";

        when(commentServiceImpl.deleteComment(any(), any()))
                .thenReturn(successMessage);

        mockMvc.perform(delete("/api/schedule/match/comments/1")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(successMessage));
    }
}