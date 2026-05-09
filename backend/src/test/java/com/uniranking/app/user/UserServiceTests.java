package com.uniranking.app.user;

import com.uniranking.app.domains.auth.exceptions.ExistedEmailException;
import com.uniranking.app.domains.auth.exceptions.UserNotFoundException;
import com.uniranking.app.domains.auth.refreshToken.RefreshTokenService;
import com.uniranking.app.domains.user.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private UserServiceImpl userServiceImpl;

    private User user;
    private UserResponse userResponse;

    @BeforeEach
    public void setup() {
        user = User.builder()
                .id(1L)
                .username("Tester1")
                .email("tester@gmail.com")
                .password("encoded_password")
                .publicUserId(UUID.randomUUID())
                .build();

        userResponse = UserResponse.builder()
                .id(1L)
                .publicUserId(user.getPublicUserId())
                .email("tester@gmail.com")
                .username("Tester1")
                .build();
    }

    @Test
    public void UserService_GetUserByRefreshToken_ReturnUserResponse() {
        when(refreshTokenService.getEmailFromToken("valid_token")).thenReturn("tester@gmail.com");
        when(userRepository.findByEmail("tester@gmail.com")).thenReturn(Optional.of(user));
        when(userMapper.userToResponse(user)).thenReturn(userResponse);

        UserResponse result = userServiceImpl.getUserByRefreshToken("valid_token");

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("tester@gmail.com");
    }

    @Test
    public void UserService_GetUserByRefreshToken_UserNotFound_ThrowsException() {
        when(refreshTokenService.getEmailFromToken("bad_token")).thenReturn("missing@gmail.com");
        when(userRepository.findByEmail("missing@gmail.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userServiceImpl.getUserByRefreshToken("bad_token"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("missing@gmail.com");
    }

    @Test
    public void UserService_UpdateUsername_ReturnUserResponse() {
        when(userRepository.updateUsername(1L, "NewName")).thenReturn(1);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.userToResponse(user)).thenReturn(userResponse);

        UserResponse result = userServiceImpl.updateUsername(1L, "NewName");

        assertThat(result).isNotNull();
        verify(userRepository).updateUsername(1L, "NewName");
    }

    @Test
    public void UserService_UpdateUsername_UserNotFound_ThrowsException() {
        when(userRepository.updateUsername(99L, "NewName")).thenReturn(0);
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userServiceImpl.updateUsername(99L, "NewName"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    public void UserService_UpdateEmail_ReturnUserResponse() {
        when(userRepository.existsByEmail("new@gmail.com")).thenReturn(false);
        when(userRepository.updateEmail(1L, "new@gmail.com")).thenReturn(1);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.userToResponse(user)).thenReturn(userResponse);

        UserResponse result = userServiceImpl.updateEmail(1L, "new@gmail.com");

        assertThat(result).isNotNull();
        verify(userRepository).updateEmail(1L, "new@gmail.com");
    }

    @Test
    public void UserService_UpdateEmail_EmailAlreadyExists_ThrowsException() {
        when(userRepository.existsByEmail("taken@gmail.com")).thenReturn(true);

        assertThatThrownBy(() -> userServiceImpl.updateEmail(1L, "taken@gmail.com"))
                .isInstanceOf(ExistedEmailException.class)
                .hasMessageContaining("already in use");

        verify(userRepository, never()).updateEmail(anyLong(), anyString());
    }

    @Test
    public void UserService_UpdateEmail_UserNotFound_ThrowsException() {
        when(userRepository.existsByEmail("new@gmail.com")).thenReturn(false);
        when(userRepository.updateEmail(99L, "new@gmail.com")).thenReturn(0);
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userServiceImpl.updateEmail(99L, "new@gmail.com"))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    public void UserService_UpdatePassword_ReturnUserResponse() {
        when(passwordEncoder.encode("RawPass123")).thenReturn("hashed_pass");
        when(userRepository.updatePassword(1L, "hashed_pass")).thenReturn(1);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.userToResponse(user)).thenReturn(userResponse);

        UserResponse result = userServiceImpl.updatePassword(1L, "RawPass123");

        assertThat(result).isNotNull();
        verify(passwordEncoder).encode("RawPass123");
        verify(userRepository).updatePassword(1L, "hashed_pass");
    }

    @Test
    public void UserService_UpdatePassword_UserNotFound_ThrowsException() {
        when(passwordEncoder.encode("RawPass123")).thenReturn("hashed_pass");
        when(userRepository.updatePassword(99L, "hashed_pass")).thenReturn(0);
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userServiceImpl.updatePassword(99L, "RawPass123"))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    public void UserService_UpdateProfileImage_ReturnUserResponse() {
        when(userRepository.updateProfileImage(1L, "base64data")).thenReturn(1);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.userToResponse(user)).thenReturn(userResponse);

        UserResponse result = userServiceImpl.updateProfileImage(1L, "base64data");

        assertThat(result).isNotNull();
        verify(userRepository).updateProfileImage(1L, "base64data");
    }

    @Test
    public void UserService_UpdateProfileImage_UserNotFound_ThrowsException() {
        when(userRepository.updateProfileImage(99L, "base64data")).thenReturn(0);
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userServiceImpl.updateProfileImage(99L, "base64data"))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    public void UserService_DeleteUser_ReturnSuccessMessage() {
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);

        String result = userServiceImpl.deleteUser(1L);

        assertThat(result).isEqualTo("Delete user successful!");
        verify(userRepository).deleteById(1L);
    }

    @Test
    public void UserService_DeleteUser_UserNotFound_ThrowsException() {
        when(userRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> userServiceImpl.deleteUser(99L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("99");

        verify(userRepository, never()).deleteById(anyLong());
    }

    @Test
    public void UserService_LoadUserByUsername_ReturnUserDetails() {
        when(userRepository.findByEmail("tester@gmail.com")).thenReturn(Optional.of(user));

        var result = userServiceImpl.loadUserByUsername("tester@gmail.com");

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("tester@gmail.com");
    }

    @Test
    public void UserService_LoadUserByUsername_NotFound_ThrowsException() {
        when(userRepository.findByEmail("nobody@gmail.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userServiceImpl.loadUserByUsername("nobody@gmail.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("nobody@gmail.com");
    }

    @Test
    public void UserService_GetAllUsers_ReturnPageOfUserResponse() {
        Page<User> userPage = new PageImpl<>(List.of(user));
        when(userRepository.findAll(PageRequest.of(0, 10))).thenReturn(userPage);
        when(userMapper.userToResponse(user)).thenReturn(userResponse);

        Page<UserResponse> result = userServiceImpl.getAllUsers(0, 10);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getEmail()).isEqualTo("tester@gmail.com");
    }

    @Test
    public void UserService_GetAllUsers_EmptyPage_ReturnEmptyPage() {
        Page<User> emptyPage = new PageImpl<>(List.of());
        when(userRepository.findAll(PageRequest.of(0, 10))).thenReturn(emptyPage);

        Page<UserResponse> result = userServiceImpl.getAllUsers(0, 10);

        assertThat(result.getContent()).isEmpty();
    }

    @Test
    public void UserService_GetUserByUsername_ReturnPageOfUserResponse() {
        Page<User> userPage = new PageImpl<>(List.of(user));
        when(userRepository.findByInput(PageRequest.of(0, 10), "Tester")).thenReturn(userPage);
        when(userMapper.userToResponse(user)).thenReturn(userResponse);

        Page<UserResponse> result = userServiceImpl.getUserByUsername(0, 10, "Tester");

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    public void UserService_GetUserByUsername_NoMatch_ReturnEmptyPage() {
        Page<User> emptyPage = new PageImpl<>(List.of());
        when(userRepository.findByInput(PageRequest.of(0, 10), "nobody")).thenReturn(emptyPage);

        Page<UserResponse> result = userServiceImpl.getUserByUsername(0, 10, "nobody");

        assertThat(result.getContent()).isEmpty();
    }
}