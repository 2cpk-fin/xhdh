package com.uniranking.app.domains.soloMatch;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import com.uniranking.app.domains.searching.university.UniversityRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.uniranking.app.domains.searching.university.University;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SoloMatchService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final UniversityRepository universityRepository;
    private final EloCalculator eloCalc = new EloCalculator();

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
        for (University uB : candidates) {
            currentSum += weights.get(uB);
            if (randomVal <= currentSum)
                return uB;
        }
        return candidates.getFirst();
    }

    public SoloMatchResponse startNewDuel() {
        // Generate two random universities
        University uni1 = universityRepository.findRandom();
        List<University> candidates = universityRepository.findAllOpponentsWithSharedTag(uni1.getId());
        University uni2 = selectWeightedOpponent(uni1, candidates);

        // Create the solo match
        UUID publicMatchId = UUID.randomUUID();
        SoloMatch soloMatch = new SoloMatch(publicMatchId, uni1.getId(), uni2.getId(), uni1.getPublicUniversityId(), uni2.getPublicUniversityId());

        // Save to Redis and set expiry key to 3 minutes
        redisTemplate.opsForValue().set(REDIS_PREFIX + publicMatchId, soloMatch, 3, TimeUnit.MINUTES);

        // Return the response
        return new SoloMatchResponse(publicMatchId, uni1.getId(), uni2.getId(), uni1.getPublicUniversityId(), uni2.getPublicUniversityId());
    }

    @Transactional
    public SoloMatchReport chooseSoloMatch(UUID publicMatchId, Long winnerId) {
        // Fetch from Redis
        SoloMatch soloMatch = (SoloMatch) redisTemplate.opsForValue().get(REDIS_PREFIX + publicMatchId);
        if (soloMatch == null) throw new RuntimeException("Match expired!");

        // Identity Winner and Loser
        Long loserId = winnerId.equals(soloMatch.getUni1Id()) ? soloMatch.getUni2Id() : soloMatch.getUni1Id();
        University winner = universityRepository.findById(winnerId)
                .orElseThrow(() -> new RuntimeException("Winner not found!"));
        University loser = universityRepository.findById(loserId)
                .orElseThrow(() -> new RuntimeException("Loser not found!"));

        // Set new elo and update the DB
        int winnerEloNew = eloCalc.calculateSoloChange(winner.getElo(), loser.getElo(), true);
        int loserEloNew = eloCalc.calculateSoloChange(loser.getElo(), winner.getElo(), false);

        winner.setElo(winnerEloNew);
        loser.setElo(loserEloNew);

        universityRepository.save(winner);
        universityRepository.save(loser);

        // Clean up Redis
        redisTemplate.delete(REDIS_PREFIX + publicMatchId);

        return new SoloMatchReport(winner.getId(), winner.getPublicUniversityId(),loser.getId(), loser.getPublicUniversityId());
    }
}
