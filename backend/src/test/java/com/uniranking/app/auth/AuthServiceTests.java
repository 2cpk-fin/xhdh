package com.uniranking.app.auth;

import com.uniranking.app.domains.auth.auth.*;
import com.uniranking.app.domains.auth.exceptions.ExistedEmailException;
import com.uniranking.app.domains.auth.refreshToken.RefreshToken;
import com.uniranking.app.domains.auth.refreshToken.RefreshTokenService;
import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserMapper;
import com.uniranking.app.domains.user.UserRepository;
import com.uniranking.app.infrastructure.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserMapper userMapper;

    @Mock
    private HttpServletRequest httpRequest;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private RefreshToken refreshToken;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .publicUserId(UUID.randomUUID())
                .username("testUser")
                .email("test@test.com")
                .password("password123")
                .build();

        registerRequest = RegisterRequest.builder()
                .username("testUser")
                .email("test@test.com")
                .password("password123")
                .build();

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password123");

        refreshToken = RefreshToken.builder()
                .token("refreshToken123")
                .email("test@test.com")
                .userId(user.getPublicUserId())
                .build();
    }

    @Test
    void register_Success() {
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userMapper.registerRequestToUser(registerRequest, "encodedPassword")).thenReturn(user);

        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("jwtToken123");
        when(refreshTokenService.createRefreshToken(user, httpRequest)).thenReturn(refreshToken);

        AuthResponse response = authService.register(registerRequest, httpRequest);

        assertNotNull(response);
        verify(passwordEncoder).encode(registerRequest.getPassword());
        verify(userMapper).registerRequestToUser(registerRequest, "encodedPassword");
    }

    @Test
    void register_ThrowsExistedEmailException() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThrows(ExistedEmailException.class, () -> authService.register(registerRequest, httpRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_Success() {
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);

        when(jwtService.generateToken(user)).thenReturn("jwtToken123");
        when(refreshTokenService.createRefreshToken(user, httpRequest)).thenReturn(refreshToken);

        AuthResponse response = authService.login(loginRequest, httpRequest);

        assertNotNull(response);
        assertEquals("testUser", response.getUsername());
        assertEquals("refreshToken123", response.getRefreshToken());
    }

    @Test
    void login_ThrowsBadCredentialsException() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest, httpRequest));
    }

    @Test
    void refreshToken_Success() {
        String oldToken = "oldRefreshToken";
        when(refreshTokenService.verifyRefreshToken(oldToken)).thenReturn(refreshToken);
        when(userRepository.findByEmail(refreshToken.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("newJwtToken");
        when(refreshTokenService.createRefreshToken(user, httpRequest)).thenReturn(refreshToken);

        AuthResponse response = authService.refreshToken(oldToken, httpRequest);

        assertNotNull(response);
        assertEquals("newJwtToken", response.getToken());
        verify(refreshTokenService).verifyMetaData(refreshToken, httpRequest);
        verify(refreshTokenService).deleteRefreshToken(oldToken);
    }

    @Test
    void logout_WithAccessToken_Success() {
        LogoutRequest logoutRequest = new LogoutRequest();
        logoutRequest.setRefreshToken("refreshToken123");
        logoutRequest.setAccessToken("accessToken123");

        LogoutResponse response = authService.logout(logoutRequest);

        assertNotNull(response);
        verify(refreshTokenService).deleteRefreshToken("refreshToken123");
        verify(refreshTokenService).blackListAccessToken("accessToken123");
    }
}