package com.xhdh.xhdh.infrastructure;

import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisTestRunner implements CommandLineRunner {
    private final RedisTemplate<String, String> redisTemplate;

    public RedisTestRunner(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- 🚀 Starting Redis Test ---");

        // 1. Save a value to Redis
        String testKey = "testing";
        String testValue = "testing2";

        redisTemplate.opsForValue().set(testKey, testValue);
        System.out.println("✅ Saved to Redis: " + testKey + " -> " + testValue);

        // 2. Retrieve it back
        String retrievedValue = redisTemplate.opsForValue().get(testKey);
        System.out.println("🔍 Retrieved from Redis: " + retrievedValue);

        System.out.println("--- ✨ Redis Test Finished ---");

        // 3. Exit the app when the test is finished
        // System.exit(0);
    }
}
