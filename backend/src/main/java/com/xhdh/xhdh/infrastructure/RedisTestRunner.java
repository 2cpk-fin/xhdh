package com.xhdh.xhdh.infrastructure;

import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisTestRunner implements CommandLineRunner {

    private final RedisTemplate<String, String> redisTemplate;

    // Use Constructor Injection - this ensures the template is 
    // already configured with the host from application.yml
    public RedisTestRunner(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- 🚀 Starting Redis Test ---");
        // This will now use 'xhdh-redis' instead of 'localhost'
        redisTemplate.opsForValue().set("test-connection", "success");
        System.out.println("--- ✅ Redis Test Passed! ---");
    }
}

