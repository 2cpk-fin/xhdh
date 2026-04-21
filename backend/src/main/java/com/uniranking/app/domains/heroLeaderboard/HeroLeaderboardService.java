package com.uniranking.app.domains.heroLeaderboard;

import java.util.List;

import com.uniranking.app.domains.searching.university.University;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uniranking.app.domains.searching.tag.Tag;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class HeroLeaderboardService {
    private final UniversityRepository universityRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    
    private static final String ZSET_KEY = "xhdh:leaderboard:global";
    private static final String HASH_KEY = "xhdh:universities:metadata";

    @Scheduled(fixedRate = 180000, initialDelay = 1000)
    @Transactional(readOnly = true)// 3 minutes per api update
    public void RedisSyncing(){
        List<University> universities = universityRepository.findAll();
        for(University uni : universities){
            redisTemplate.opsForZSet().add(ZSET_KEY, uni.getAbbreviation(),uni.getElo());
            
            List<String> tagNames = uni.getTags().stream()
                                   .map(Tag::getName)
                                   .toList();

            UniversityMetadata metadata = new UniversityMetadata(
                uni.getName(),
                uni.getAbbreviation(),
                uni.getElo(),
                tagNames
            );

            redisTemplate.opsForHash().put(HASH_KEY, uni.getAbbreviation(), metadata);
        }
    }

}