package com.uniranking.app.common;

import com.uniranking.app.domains.auth.refreshToken.RefreshTokenService;
import com.uniranking.app.infrastructure.security.JwtAuthenticationFilter;
import com.uniranking.app.infrastructure.security.JwtService;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
public abstract class BaseControllerTest {

    @MockitoBean
    protected RefreshTokenService refreshTokenService;

    @MockitoBean
    protected JwtService jwtService;
}