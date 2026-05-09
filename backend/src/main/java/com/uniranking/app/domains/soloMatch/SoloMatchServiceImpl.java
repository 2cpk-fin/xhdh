package com.uniranking.app.domains.soloMatch;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.uniranking.app.domains.searching.exceptions.UniversityNotFoundException;
import com.uniranking.app.domains.searching.university.UniversityMapper;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import com.uniranking.app.domains.searching.university.University;

import com.uniranking.app.domains.soloMatch.exceptions.SoloMatchExpiredException;
import com.uniranking.app.domains.soloMatch.exceptions.InsufficientOpponentsException;
import com.uniranking.app.domains.soloMatch.exceptions.InvalidMatchParticipantException;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SoloMatchServiceImpl implements SoloMatchService {

    private final UniversityRepository universityRepository;
    private final UniversityMapper universityMapper;

    private final SoloMatchRedisPort soloMatchRedisPort;
    private final EloCalculator eloCalc = new EloCalculator();

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

    @Override
    public SoloMatchResponse startNewDuel() {
        University uni1 = universityRepository.findRandom();
        List<University> candidates = universityRepository.findAllOpponentsWithSharedTag(uni1.getId());

        // Throw exception instead of returning null
        if (candidates.isEmpty()) {
            throw new InsufficientOpponentsException("Not enough universities with shared tags to generate a match.");
        }

        University uni2 = selectWeightedOpponent(uni1, candidates);

        UUID publicMatchId = UUID.randomUUID();
        SoloMatch soloMatch = new SoloMatch(publicMatchId, uni1.getId(), uni2.getId(), uni1.getPublicUniversityId(),
                uni2.getPublicUniversityId());

        soloMatchRedisPort.saveMatch(soloMatch, 3);

        return new SoloMatchResponse(
                publicMatchId,
                universityMapper.toUniversityResponse(uni1),
                universityMapper.toUniversityResponse(uni2));
    }

    @Override
    @Transactional
    public SoloMatchReport chooseWinner(UUID publicMatchId, Long winnerId) {
        SoloMatch soloMatch;
        soloMatch = soloMatchRedisPort.getMatch(publicMatchId);

        if (soloMatch == null) {
            throw new SoloMatchExpiredException("This match has expired or does not exist.");
        }

        // Security Check: Ensure the winnerId actually belongs to this specific match
        if (!winnerId.equals(soloMatch.getUni1Id()) && !winnerId.equals(soloMatch.getUni2Id())) {
            throw new InvalidMatchParticipantException("The provided winner ID was not a participant in this match.");
        }

        Long loserId = winnerId.equals(soloMatch.getUni1Id()) ? soloMatch.getUni2Id() : soloMatch.getUni1Id();

        // Safely unwrap optionals instead of using .get()
        University winner = universityRepository.findById(winnerId)
                .orElseThrow(() -> new UniversityNotFoundException("Winning university not found."));
        University loser = universityRepository.findById(loserId)
                .orElseThrow(() -> new UniversityNotFoundException("Losing university not found."));

        // Set new elo and update DB
        int winnerEloNew = eloCalc.calculateSoloChange(winner.getElo(), loser.getElo(), true);
        int winnerEloChange = winnerEloNew - winner.getElo();

        int loserEloNew = eloCalc.calculateSoloChange(loser.getElo(), winner.getElo(), false);
        int loserEloChange = loser.getElo() - loserEloNew;

        winner.setElo(winnerEloNew);
        loser.setElo(loserEloNew);

        universityRepository.save(winner);
        universityRepository.save(loser);

        soloMatchRedisPort.deleteMatch(publicMatchId);

        return new SoloMatchReport(
                universityMapper.toUniversityResponse(winner), winnerEloChange,
                universityMapper.toUniversityResponse(loser), loserEloChange);
    }
}