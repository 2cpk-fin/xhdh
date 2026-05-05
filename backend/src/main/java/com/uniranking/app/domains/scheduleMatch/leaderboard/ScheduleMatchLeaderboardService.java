package com.uniranking.app.domains.scheduleMatch.leaderboard;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import com.uniranking.app.domains.searching.university.University;
import com.uniranking.app.domains.searching.university.UniversityMapper;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ScheduleMatchLeaderboardService {
    private final UniversityRepository universityRepository;
    private final UniversityMapper universityMapper;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String LEADERBOARD_PREFIX = "leaderboard:match:";

    public List<ScheduleParticipantResponse> showLeaderboard(String publicMatchId) {
        String leaderboardKey = LEADERBOARD_PREFIX + publicMatchId;
        Set<ZSetOperations.TypedTuple<Object>> participants = redisTemplate.opsForZSet().reverseRangeWithScores(leaderboardKey, 0, -1);

        List<ScheduleParticipantResponse> topParticipants = new ArrayList<>();
        if (participants == null || participants.isEmpty()) {
            return topParticipants;
        }

        int currentRank = 1;
        for (ZSetOperations.TypedTuple<Object> participant : participants) {
            ScheduleParticipantResponse response = new ScheduleParticipantResponse();
            int totalVotes = 0;
            long universityId = 0L;

            if (participant != null && participant.getValue() != null) {
                universityId = Long.parseLong(participant.getValue().toString());
                totalVotes = (participant.getScore() != null) ? participant.getScore().intValue() : 0;
            }

            University university = universityRepository.findById(universityId)
                    .orElseThrow(() -> new RuntimeException("Participant not found"));

            response.setUniversityResponse(universityMapper.mapToResponseWithTags(university));
            response.setTotalVotes(totalVotes);
            response.setRank(currentRank++);

            topParticipants.add(response);
        }

        return topParticipants;
    }
}