package com.uniranking.app.searching.university;

import com.uniranking.app.domains.auth.RefreshTokenService;
import com.uniranking.app.domains.searching.university.UniversityController;
import com.uniranking.app.domains.searching.university.UniversityResponse;
import com.uniranking.app.domains.searching.university.UniversityService;
import com.uniranking.app.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value= UniversityController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable Spring Security
@ExtendWith(MockitoExtension.class)
public class UniversityControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UniversityService universityService;

    @MockitoBean
    private RefreshTokenService refreshTokenService;

    @MockitoBean
    private JwtService jwtService;

    UniversityResponse universityResponse1;
    UniversityResponse universityResponse2;

    PageRequest pageRequest;

    @BeforeEach
    public void setUp() {
        universityResponse1 = UniversityResponse.builder()
                .name("University of Engineering and Technology")
                .build();
        universityResponse2 = UniversityResponse.builder()
                .name("Hanoi University of Science and Technology")
                .build();

        pageRequest = PageRequest.of(0, 15);
    }

    @Test
    public void returnPageOfUniversityResponses() throws Exception {
        Page<UniversityResponse> result = new PageImpl<>(List.of(universityResponse1, universityResponse2));

        when(universityService.getUniversityListByInput(eq(pageRequest), any(), any())).thenReturn(result);

        mockMvc.perform(get("/api/universities")
                        .param("page", "0")
                        .param("size", "15"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].name").value("University of Engineering and Technology"))
                .andExpect(jsonPath("$.content[1].name").value("Hanoi University of Science and Technology"));
    }
}
