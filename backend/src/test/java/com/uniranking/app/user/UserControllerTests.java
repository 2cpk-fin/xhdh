package com.uniranking.app.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uniranking.app.common.BaseControllerTest;
import com.uniranking.app.domains.auth.exceptions.UserNotFoundException;
import com.uniranking.app.domains.user.UserController;
import com.uniranking.app.domains.user.UserResponse;
import com.uniranking.app.domains.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTests extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserResponse userResponse;

    @BeforeEach
    public void setup() {
        userResponse = UserResponse.builder()
                .id(1L)
                .publicUserId(UUID.randomUUID())
                .email("tester@gmail.com")
                .username("Tester1")
                .profileImage(null)
                .build();
    }

    @Test
    public void UserController_GetUserByRefreshToken_Return200AndUserResponse() throws Exception {
        when(userService.getUserByRefreshToken("valid_token")).thenReturn(userResponse);

        mockMvc.perform(post("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("refreshToken", "valid_token"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("tester@gmail.com"))
                .andExpect(jsonPath("$.username").value("Tester1"));
    }

    @Test
    public void UserController_GetUserByRefreshToken_InvalidToken_Return404() throws Exception {
        when(userService.getUserByRefreshToken("bad_token"))
                .thenThrow(new UserNotFoundException("User not found"));

        mockMvc.perform(post("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("refreshToken", "bad_token"))))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found"));
    }

    @Test
    public void UserController_UpdateUsername_Return200AndUserResponse() throws Exception {
        when(userService.updateUsername(1L, "NewUsername")).thenReturn(userResponse);

        mockMvc.perform(patch("/api/users/1/username")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("newUsername", "NewUsername"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    public void UserController_UpdateEmail_Return200AndUserResponse() throws Exception {
        when(userService.updateEmail(1L, "new@gmail.com")).thenReturn(userResponse);

        mockMvc.perform(patch("/api/users/1/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("newEmail", "new@gmail.com"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("tester@gmail.com"));
    }

    @Test
    public void UserController_UpdatePassword_Return200AndUserResponse() throws Exception {
        when(userService.updatePassword(1L, "NewSecurePass!")).thenReturn(userResponse);

        mockMvc.perform(patch("/api/users/1/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("newPassword", "NewSecurePass!"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    public void UserController_UpdateProfileImage_Return200AndUserResponse() throws Exception {
        when(userService.updateProfileImage(1L, "base64imagedata")).thenReturn(userResponse);

        mockMvc.perform(patch("/api/users/1/profile-image")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("imageProfile", "base64imagedata"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    public void UserController_UpdateProfileImage_MissingImageField_Return400() throws Exception {
        mockMvc.perform(patch("/api/users/1/profile-image")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("wrongKey", "somedata"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void UserController_DeleteUser_Return200AndSuccessMessage() throws Exception {
        when(userService.deleteUser(1L)).thenReturn("Delete user successful!");

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Delete user successful!"));
    }

    @Test
    public void UserController_DeleteUser_UserNotFound_Return404() throws Exception {
        when(userService.deleteUser(99L))
                .thenThrow(new UserNotFoundException("Cannot delete: User not found with ID: 99"));

        mockMvc.perform(delete("/api/users/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Cannot delete: User not found with ID: 99"));
    }

    @Test
    public void UserController_GetUserByUsername_Return200AndPage() throws Exception {
        Page<UserResponse> page = new PageImpl<>(List.of(userResponse));
        when(userService.getUserByUsername(0, 10, "Tester")).thenReturn(page);

        mockMvc.perform(get("/api/users/Tester")
                        .param("pageNo", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].username").value("Tester1"));
    }

    @Test
    public void UserController_GetUserByUsername_NoResults_Return200AndEmptyPage() throws Exception {
        Page<UserResponse> emptyPage = new PageImpl<>(List.of());
        when(userService.getUserByUsername(0, 10, "nonexistent")).thenReturn(emptyPage);

        mockMvc.perform(get("/api/users/nonexistent")
                        .param("pageNo", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());
    }

    @Test
    public void UserController_GetAllUsers_Return200AndPage() throws Exception {
        Page<UserResponse> page = new PageImpl<>(List.of(userResponse));
        when(userService.getAllUsers(0, 10)).thenReturn(page);

        mockMvc.perform(get("/api/users/admin/get-all")
                        .param("pageNo", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].email").value("tester@gmail.com"));
    }

    @Test
    public void UserController_GetAllUsers_EmptyDatabase_Return200AndEmptyPage() throws Exception {
        Page<UserResponse> emptyPage = new PageImpl<>(List.of());
        when(userService.getAllUsers(0, 10)).thenReturn(emptyPage);

        mockMvc.perform(get("/api/users/admin/get-all")
                        .param("pageNo", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());
    }
}