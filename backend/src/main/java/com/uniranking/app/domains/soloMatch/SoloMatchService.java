package com.uniranking.app.domains.soloMatch;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import com.uniranking.app.domains.searching.university.UniversityMapper;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import com.uniranking.app.domains.searching.university.UniversityResponse;
import jakarta.transaction.Transactional;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.uniranking.app.domains.searching.university.University;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SoloMatchService {
    private final UniversityRepository universityRepository;
    private final UniversityMapper universityMapper;

    private final EloCalculator eloCalc = new EloCalculator();

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String REDIS_PREFIX = "solo_match:";

    private University selectWeightedOpponent(University uni1, List<University> candidates) {
        double totalWeight = 0;
        Map<University, Double> weights = new HashMap<>();

        for (University uni2 : candidates) {
            int eloDiff = Math.abs(uni1.getElo() - uni2.getElo());
            double weight = Math.max(1.0, 1000.0 - eloDiff);
            weights.put(uni2, weight);
            totalWeight += weight;
        }

        double randomVal = Math.random() * totalWeight;
        double currentSum = 0;
        for (University uni2 : candidates) {
            currentSum += weights.get(uni2);
            if (randomVal <= currentSum)
                return uni2;
        }
        return candidates.getFirst();
    }

    public SoloMatchResponse startNewDuel() {
        // Generate two random universities
        University uni1 = universityRepository.findRandom();
        List<University> candidates = universityRepository.findAllOpponentsWithSharedTag(uni1.getId());
        if (candidates.isEmpty()) return null;
        University uni2 = selectWeightedOpponent(uni1, candidates);

        // Create the solo match
        UUID publicMatchId = UUID.randomUUID();
        SoloMatch soloMatch = new SoloMatch(publicMatchId, uni1.getId(), uni2.getId(), uni1.getPublicUniversityId(), uni2.getPublicUniversityId());

        // Save to Redis and set expiry key to 3 minutes
        redisTemplate.opsForValue().set(REDIS_PREFIX + publicMatchId, soloMatch, 3, TimeUnit.MINUTES);

        // Return the response
        UniversityResponse uni1Response = universityMapper.mapToResponseWithTags(uni1);
        UniversityResponse uni2Response = universityMapper.mapToResponseWithTags(uni2);
        return new SoloMatchResponse(publicMatchId, uni1Response, uni2Response);
    }

    @Transactional
    public SoloMatchReport chooseWinner(UUID publicMatchId, Long winnerId) {
        // Fetch from Redis
        SoloMatch soloMatch = (SoloMatch) redisTemplate.opsForValue().get(REDIS_PREFIX + publicMatchId);
        if (soloMatch == null) throw new RuntimeException("Match expired!");

        // Identity Winner and Loser
        Long loserId = winnerId.equals(soloMatch.getUni1Id()) ? soloMatch.getUni2Id() : soloMatch.getUni1Id();
        University winner = universityRepository.findById(winnerId).get();
        University loser = universityRepository.findById(loserId).get();

        // Set new elo and update the DB
        int winnerEloNew = eloCalc.calculateSoloChange(winner.getElo(), loser.getElo(), true);
        int winnerEloChange = winnerEloNew - winner.getElo();
        int loserEloNew = eloCalc.calculateSoloChange(loser.getElo(), winner.getElo(), false);
        int loserEloChange = loser.getElo() - loserEloNew;

        winner.setElo(winnerEloNew);
        loser.setElo(loserEloNew);

        universityRepository.save(winner);
        universityRepository.save(loser);

        // Clean up Redis
        redisTemplate.delete(REDIS_PREFIX + publicMatchId);

        // Return the response
        UniversityResponse winnerResponse = universityMapper.mapToResponseWithTags(winner);
        UniversityResponse loserResponse = universityMapper.mapToResponseWithTags(loser);
        return new SoloMatchReport(winnerResponse, winnerEloChange, loserResponse, loserEloChange);
    }
}
