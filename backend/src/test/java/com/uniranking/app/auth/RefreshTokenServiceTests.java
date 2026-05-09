package com.uniranking.app.auth;

import com.uniranking.app.domains.auth.exceptions.InvalidSessionException;
import com.uniranking.app.domains.auth.exceptions.RefreshTokenExpiredException;
import com.uniranking.app.domains.auth.exceptions.RefreshTokenNotFoundException;
import com.uniranking.app.domains.auth.exceptions.SuspiciousTokenUsageException;
import com.uniranking.app.domains.auth.refreshToken.RefreshToken;
import com.uniranking.app.domains.auth.refreshToken.RefreshTokenRedisPort;
import com.uniranking.app.domains.auth.refreshToken.RefreshTokenServiceImpl;
import com.uniranking.app.domains.user.User;
import com.uniranking.app.infrastructure.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTests {

    @Mock
    private RefreshTokenRedisPort refreshTokenRedisPort;

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private RefreshTokenServiceImpl refreshTokenServiceImpl;

    private User user;
    private UUID userId;
    private RefreshToken validToken;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        user = User.builder()
                .publicUserId(userId)
                .email("test@test.com")
                .username("testUser")
                .build();

        validToken = RefreshToken.builder()
                .userId(userId)
                .email("test@test.com")
                .token("validTokenUUID")
                .expiryDate(Instant.now().plus(Duration.ofDays(1)))
                .ipAddress("127.0.0.1")
                .userAgent("TestAgent")
                .build();
    }

    @Test
    void createRefreshToken_NoExistingToken_Success() {
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("User-Agent")).thenReturn("TestAgent");
        when(refreshTokenRedisPort.getActiveTokenIdForUser(userId.toString())).thenReturn(null);

        RefreshToken result = refreshTokenServiceImpl.createRefreshToken(user, request);

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
        assertEquals("127.0.0.1", result.getIpAddress());
        assertEquals("TestAgent", result.getUserAgent());
        assertNotNull(result.getToken());

        verify(refreshTokenRedisPort, never()).deleteRefreshTokenData(anyString());
        verify(refreshTokenRedisPort).storeRefreshToken(eq(result.getToken()), eq(result), any(Duration.class));
        verify(refreshTokenRedisPort).mapUserToToken(eq(userId.toString()), eq(result.getToken()), any(Duration.class));
    }

    @Test
    void createRefreshToken_WithExistingToken_DeletesOldAndCreatesNew() {
        String oldToken = "oldTokenUUID";
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("User-Agent")).thenReturn("TestAgent");
        when(refreshTokenRedisPort.getActiveTokenIdForUser(userId.toString())).thenReturn(oldToken);

        RefreshToken result = refreshTokenServiceImpl.createRefreshToken(user, request);

        assertNotNull(result);
        assertNotEquals(oldToken, result.getToken());

        verify(refreshTokenRedisPort).deleteRefreshTokenData(oldToken);
        verify(refreshTokenRedisPort).storeRefreshToken(eq(result.getToken()), eq(result), any(Duration.class));
        verify(refreshTokenRedisPort).mapUserToToken(eq(userId.toString()), eq(result.getToken()), any(Duration.class));
    }

    @Test
    void verifyRefreshToken_ValidToken_ReturnsToken() {
        when(refreshTokenRedisPort.getRefreshToken("validTokenUUID")).thenReturn(validToken);

        RefreshToken result = refreshTokenServiceImpl.verifyRefreshToken("validTokenUUID");

        assertEquals(validToken, result);
    }

    @Test
    void verifyRefreshToken_TokenNotFound_ThrowsException() {
        when(refreshTokenRedisPort.getRefreshToken("invalidToken")).thenReturn(null);

        assertThrows(RefreshTokenNotFoundException.class,
                () -> refreshTokenServiceImpl.verifyRefreshToken("invalidToken"));
    }

    @Test
    void verifyRefreshToken_TokenExpired_ThrowsException() {
        RefreshToken expiredToken = RefreshToken.builder()
                .expiryDate(Instant.now().minus(Duration.ofDays(1)))
                .build();
        when(refreshTokenRedisPort.getRefreshToken("expiredToken")).thenReturn(expiredToken);

        assertThrows(RefreshTokenExpiredException.class,
                () -> refreshTokenServiceImpl.verifyRefreshToken("expiredToken"));
    }

    @Test
    void verifyMetaData_ValidMetaData_DoesNotThrow() {
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("User-Agent")).thenReturn("TestAgent");

        assertDoesNotThrow(() -> refreshTokenServiceImpl.verifyMetaData(validToken, request));
    }

    @Test
    void verifyMetaData_InvalidIp_ThrowsException() {
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");
        when(request.getHeader("User-Agent")).thenReturn("TestAgent");

        assertThrows(SuspiciousTokenUsageException.class,
                () -> refreshTokenServiceImpl.verifyMetaData(validToken, request));
    }

    @Test
    void verifyMetaData_InvalidUserAgent_ThrowsException() {
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("User-Agent")).thenReturn("HackerAgent");

        assertThrows(SuspiciousTokenUsageException.class,
                () -> refreshTokenServiceImpl.verifyMetaData(validToken, request));
    }

    @Test
    void deleteRefreshToken_TokenExists_DeletesMappingAndToken() {
        when(refreshTokenRedisPort.getRefreshToken("validTokenUUID")).thenReturn(validToken);

        refreshTokenServiceImpl.deleteRefreshToken("validTokenUUID");

        verify(refreshTokenRedisPort).removeUserTokenMapping(userId.toString());
        verify(refreshTokenRedisPort).deleteRefreshTokenData("validTokenUUID");
    }

    @Test
    void deleteRefreshToken_TokenDoesNotExist_FallbackDeletion() {
        when(refreshTokenRedisPort.getRefreshToken("missingToken")).thenReturn(null);

        refreshTokenServiceImpl.deleteRefreshToken("missingToken");

        verify(refreshTokenRedisPort).deleteRefreshTokenData("missingToken");
        verify(refreshTokenRedisPort, never()).removeUserTokenMapping(anyString());
    }

    @Test
    void blackListAccessToken_PositiveTtl_SavesToRedis() {
        String token = "accessToken";
        Date futureDate = new Date(System.currentTimeMillis() + 10000);

        // This will now work because jwtService is correctly injected
        when(jwtService.extractExpiration(token)).thenReturn(futureDate);

        refreshTokenServiceImpl.blackListAccessToken(token);

        verify(refreshTokenRedisPort).blacklistToken(eq(token), any(Duration.class));
    }

    @Test
    void blackListAccessToken_NegativeTtl_DoesNotSave() {
        String token = "accessToken";
        Date pastDate = new Date(System.currentTimeMillis() - 10000);
        when(jwtService.extractExpiration(token)).thenReturn(pastDate);

        refreshTokenServiceImpl.blackListAccessToken(token);

        verify(refreshTokenRedisPort, never()).blacklistToken(anyString(), any(Duration.class));
    }

    @Test
    void isAccessTokenBlacklisted_Exists_ReturnsTrue() {
        when(refreshTokenRedisPort.isBlacklisted("accessToken")).thenReturn(true);

        assertTrue(refreshTokenServiceImpl.isAccessTokenBlacklisted("accessToken"));
    }

    @Test
    void isAccessTokenBlacklisted_DoesNotExist_ReturnsFalse() {
        when(refreshTokenRedisPort.isBlacklisted("validToken")).thenReturn(false);

        assertFalse(refreshTokenServiceImpl.isAccessTokenBlacklisted("validToken"));
    }

    @Test
    void getEmailFromToken_ValidToken_ReturnsEmail() {
        when(refreshTokenRedisPort.getRefreshToken("validTokenUUID")).thenReturn(validToken);

        String email = refreshTokenServiceImpl.getEmailFromToken("validTokenUUID");

        assertEquals("test@test.com", email);
    }

    @Test
    void getEmailFromToken_InvalidToken_ThrowsException() {
        when(refreshTokenRedisPort.getRefreshToken("invalidToken")).thenReturn(null);

        assertThrows(InvalidSessionException.class, () -> refreshTokenServiceImpl.getEmailFromToken("invalidToken"));
    }
}