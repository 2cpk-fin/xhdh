package com.uniranking.app.infrastructure.config;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// CORS (Cross-Origin Resource Sharing) is a security "handshake" that allows your Backend to tell the browser:
// "I trust this specific Frontend URL, so let its requests through."
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/api/**") // This tells Spring Boot: "Only apply these rules to URLs that start with /api/
                        .allowedOrigins("http://localhost:5173",
                                        "https://xhdh-wine.vercel.app") // The trusted URLs (WHO)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // (WHAT can you do)
                        .allowedHeaders("*") // HOW can you do
                        .allowCredentials(true); // Turn this on and the FE can send private information back to BE
            }
        };
    }
}

