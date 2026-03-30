package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.domain.models.Participant;
import com.xhdh.xhdh.infrastructure.repositories.LeaderboardRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private LeaderboardRepository leaderboardRepository;

    private RedisTemplate<String, Object> redisTemplate;

    private static final String ZSET_KEY = "leaderboards:votes";

    public void vote(Long universityId) {
        Participant p = leaderboardRepository.findById(String.valueOf(universityId))
                .orElseThrow(() -> new RuntimeException("University not found"));
        p.setVote(p.getVote() + 1);
        leaderboardRepository.save(p);

        redisTemplate.opsForZSet().incrementScore(ZSET_KEY, universityId, 1);
    }

    public List<Participant> showLeaderboard() {
        Set<Object> universityIds = redisTemplate.opsForZSet().reverseRange(ZSET_KEY, 0, -1);

        List<Participant> topParticipants = new ArrayList<>();

        for (Object universityId : universityIds) {
            Participant p = leaderboardRepository.findById(universityId.toString())
                    .orElseThrow(() -> new RuntimeException("University not found"));

            Long rank = redisTemplate.opsForZSet().reverseRank(ZSET_KEY, universityId);
            p.setRank(rank.intValue());
            topParticipants.add(p);
        }

        return topParticipants;
    }


}
