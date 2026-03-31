package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.domain.models.Participant;
import com.xhdh.xhdh.infrastructure.repositories.redis.LeaderboardRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;

    private final RedisTemplate<String, Object> redisTemplate;

    private String getMatchKey(String matchId) {
        return "leaderboard:match:" + matchId;
    }

    public void vote(Long universityId, String matchId) {
        String key = getMatchKey(matchId);

        redisTemplate.opsForZSet().incrementScore(key, universityId, 1);

        Participant p = leaderboardRepository.findById(String.valueOf(universityId))
            .orElseThrow(() -> new RuntimeException("University not found"));
        p.setVote(p.getVote() + 1);
        leaderboardRepository.save(p);
    }

    public List<Participant> showLeaderboard(String matchId) {
        String key = getMatchKey(matchId);

        Set<Object> universityIds = redisTemplate.opsForZSet().reverseRange(key, 0, -1);

        List<Participant> topParticipants = new ArrayList<>();

        for (Object universityId : universityIds) {
            Participant p = leaderboardRepository.findById(universityId.toString())
                    .orElseThrow(() -> new RuntimeException("University not found"));

            Long rank = redisTemplate.opsForZSet().reverseRank(key, universityId);
            p.setRank(rank.intValue());
            topParticipants.add(p);
        }
        return topParticipants;
    }
}
