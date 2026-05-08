package com.uniranking.app.searching.tag;

import com.uniranking.app.domains.auth.refreshToken.RefreshTokenService;
import com.uniranking.app.domains.searching.tag.TagController;
import com.uniranking.app.domains.searching.tag.TagResponse;
import com.uniranking.app.domains.searching.tag.TagService;
import com.uniranking.app.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = TagController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class TagControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TagService tagService;

    @MockitoBean
    private RefreshTokenService refreshTokenService;

    @MockitoBean
    private JwtService jwtService;

    TagResponse tagResponse1;
    TagResponse tagResponse2;

    @BeforeEach
    public void setup() {
        tagResponse1 = TagResponse.builder().name("Engineering").build();
        tagResponse2 = TagResponse.builder().name("Finance").build();
    }

    @Test
    public void returnAllTags() throws Exception { // Why we have to throw exception
        List<TagResponse> result = List.of(tagResponse1, tagResponse2);

        when(tagService.showAllTags()).thenReturn(result);

        mockMvc.perform(get("/api/tags/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("Engineering"))
                .andExpect(jsonPath("$[1].name").value("Finance"));
    }

    @Test
    public void returnAllTagsInUniversity() throws Exception {
        Long universityId = 1L;
        List<TagResponse> result = List.of(tagResponse1, tagResponse2);

        when(tagService.showAllTagsInUniversity(universityId)).thenReturn(result);

        mockMvc.perform(get("/api/tags/{universityId}", universityId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("Engineering"))
                .andExpect(jsonPath("$[1].name").value("Finance"));
    }

}
