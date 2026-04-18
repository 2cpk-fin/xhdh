package com.xhdh.xhdh.presentation.controllers.search;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xhdh.xhdh.application.dto.search.UniversityMetadataDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/universities") // Unified the path for clarity
public class UniversityLeaderboardController {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String HASH_KEY = "xhdh:universities:metadata";

    @GetMapping("/all")
    public ResponseEntity<List<UniversityMetadataDTO>> getAllUniversities() {
    Map<Object, Object> entries = redisTemplate.opsForHash().entries(HASH_KEY);
    
    if (entries == null || entries.isEmpty()) {
        // Return empty list instead of letting the mapper fail
        return ResponseEntity.ok(Collections.emptyList());
    }

    List<UniversityMetadataDTO> result = entries.values().stream()
            .filter(Objects::nonNull)
            .map(obj -> (UniversityMetadataDTO) obj)
            .toList();

    return ResponseEntity.ok(result);
}
}