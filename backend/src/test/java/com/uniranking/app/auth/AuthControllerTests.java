package com.uniranking.app.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uniranking.app.common.BaseControllerTest;
import com.uniranking.app.domains.auth.auth.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTests extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    private AuthResponse authResponse;

    @BeforeEach
    public void setUp() {
        authResponse = AuthResponse.builder()
                .username("testUser")
                .email("test@test.com")
                .token("jwtToken123")
                .refreshToken("refreshToken123")
                .build();
    }

    @Test
    void registerUser_ReturnsOk() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("testUser")
                .email("test@test.com")
                .password("password123")
                .build();

        when(authService.register(any(RegisterRequest.class), any())).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testUser"))
                .andExpect(jsonPath("$.token").value("jwtToken123"));
    }

    @Test
    void registerUser_InvalidEmail_ReturnsBadRequest() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("testUser")
                .email("invalid-email")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginRequest_ReturnsOk() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password123");

        when(authService.login(any(LoginRequest.class), any())).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@test.com"))
                .andExpect(jsonPath("$.refreshToken").value("refreshToken123"));
    }

    @Test
    void loginRequest_MissingPassword_ReturnsBadRequest() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void logoutRequest_ReturnsOk() throws Exception {
        LogoutRequest request = new LogoutRequest();
        request.setRefreshToken("refreshToken123");

        LogoutResponse response = new LogoutResponse("Logout successful");
        when(authService.logout(any(LogoutRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    void refreshToken_ReturnsOk() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("refreshToken", "refreshToken123");

        when(authService.refreshToken(anyString(), any())).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwtToken123"));
    }
}