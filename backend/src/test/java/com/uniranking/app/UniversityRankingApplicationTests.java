package com.uniranking.app;

import com.uniranking.app.domains.auth.refreshToken.RefreshTokenRedisPort;
import com.uniranking.app.domains.scheduleMatch.match.MatchExpirationListener;
import com.uniranking.app.infrastructure.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@EnableAutoConfiguration(exclude = {
		RedisAutoConfiguration.class,
		RedisRepositoriesAutoConfiguration.class
})
@TestPropertySource(properties = {
		"spring.data.redis.repositories.key-space-notifications-enabled=false",
		"spring.security.oauth2.client.registration.google.client-id=test",
		"spring.security.oauth2.client.registration.google.client-secret=test",
		"spring.security.oauth2.client.registration.google.redirect-uri=http://localhost",
		"spring.security.oauth2.client.registration.google.scope=email,profile"
})
class UniversityRankingApplicationTests {

	@MockitoBean
	private RefreshTokenRedisPort refreshTokenRedisPort;

	@MockitoBean
	private JwtService jwtService;

	@MockitoBean
	private RedisConnectionFactory redisConnectionFactory;

	@MockitoBean
	private RedisTemplate<String, Object> redisTemplate;

	@MockitoBean
	private ClientRegistrationRepository clientRegistrationRepository;

	@MockitoBean
	private MatchExpirationListener matchExpirationListener;

	@Test
	void contextLoads() {
	}
}