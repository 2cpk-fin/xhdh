package com.xhdh.xhdh.application.services;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.xhdh.xhdh.application.dto.matches.SoloMatchReport;
import com.xhdh.xhdh.application.utilities.EloCalculator;
import com.xhdh.xhdh.domain.models.Status;
import com.xhdh.xhdh.infrastructure.repositories.jpa.*;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.xhdh.xhdh.application.dto.matches.MatchResponseDTO;
import com.xhdh.xhdh.application.dto.searches.UniversityDTO;
import com.xhdh.xhdh.presentation.exceptions.NotEnoughUniException;
import com.xhdh.xhdh.domain.models.Match;
import com.xhdh.xhdh.domain.models.MatchParticipant;
import com.xhdh.xhdh.domain.models.SoloMatch;
import com.xhdh.xhdh.domain.models.University;
import com.xhdh.xhdh.domain.models.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SoloMatchService {
    private final UniversityRepository universityRepository;

    private final UserRepository userRepository;

    private final SoloMatchRepository soloMatchRepository;

    @Scheduled(fixedRate = 60000) // Check every minute for expired solo matches
    @Transactional
    protected void expireSoloMatches() {
        Instant now = Instant.now();
        List<SoloMatch> expiredMatches = soloMatchRepository.findAll().stream()
                .filter(match -> match.getStatus() == Status.PENDING && match.getEndDate().isBefore(now))
                .toList();

        for (SoloMatch soloMatch : expiredMatches) {
            soloMatch.setStatus(Status.FINISHED);
            soloMatch.setWinner(null);
            soloMatch.setLoser(null);
            soloMatch.setEloChange(0);
            soloMatchRepository.save(soloMatch);
        }
    }

    private University selectWeightedOpponent(University uA, List<University> candidates) {
        double totalWeight = 0;
        Map<University, Double> weights = new HashMap<>();

        for (University uB : candidates) {
            int eloDiff = Math.abs(uA.getElo() - uB.getElo());
            double weight = Math.max(1.0, 1000.0 - eloDiff);
            weights.put(uB, weight);
            totalWeight += weight;
        }

        double randomVal = Math.random() * totalWeight;
        double currentSum = 0;
        for (University uB : candidates) {
            currentSum += weights.get(uB);
            if (randomVal <= currentSum) return uB;
        }
        return candidates.getFirst();
    }

    /**
     * Starts a new solo match by generating 2 random universities for the user to choose from.
     * Creates a SoloMatch entity with PENDING status and 3-minute duration.
     * Returns MatchResponseDTO with the two universities and ownerUUID.
     */
    public MatchResponseDTO startNewDuel(User user) {
        // Generate two random universities
        University uA = universityRepository.findRandom();
        List<University> candidates = universityRepository.findAllOpponentsWithSharedTag(uA.getId());
        candidates.removeIf(u -> u.getId() == uA.getId());
        
        if (candidates.isEmpty()) {
            throw new NotEnoughUniException("Not enough universities to match");
        }

        University uB = selectWeightedOpponent(uA, candidates);

        // Create the solo match
        Instant now = Instant.now();
        SoloMatch soloMatch = SoloMatch.builder()
            .ownerUUID(user.getUserUUID())
            .matchUUID(UUID.randomUUID())
            .universityA(uA)
            .universityB(uB)
            .startDate(now)
            .endDate(now.plusSeconds(3 * 60)) // 3 minutes from start
            .status(Status.PENDING)
            .build();
        
        soloMatchRepository.save(soloMatch);

        return new MatchResponseDTO(
            soloMatch.getMatchUUID(),
            uA.getAbbreviation() + " vs " + uB.getAbbreviation(),
            soloMatch.getStatus(),
            soloMatch.getStartDate(),
            soloMatch.getEndDate(),
            new UniversityDTO(uA.getPublicUniversityId(), uA.getName(), uA.getAbbreviation(), uA.getElo()),
            new UniversityDTO(uB.getPublicUniversityId(), uB.getName(), uB.getAbbreviation(), uB.getElo()),
            user.getUserUUID()
        );
    }

    /**
     * Decides winner and loser based on votes in the match.
     * Returns SoloMatchReport with winner and loser UUIDs and ELO change amount.
     * If no clear winner is decided, returns SoloMatchReport with null winnerId/loserId and 0 eloChange.
     */
    public SoloMatchReport decideWinnerAndLoser(Match match) {
        List<MatchParticipant> participants = match.getParticipants();

        if (participants.isEmpty() || participants.size() < 2) {
            return new SoloMatchReport(null, null, 0);
        }

        // Sort participants by total votes in descending order
        participants.sort((p1, p2) -> Long.compare(p2.getTotalVotes(), p1.getTotalVotes()));

        MatchParticipant first = participants.get(0);
        MatchParticipant second = participants.get(1);

        // If votes are equal or first has no votes, no decision
        if (first.getTotalVotes() == 0 || first.getTotalVotes() == second.getTotalVotes()) {
            return new SoloMatchReport(null, null, 0);
        }

        // Calculate ELO change using EloCalculator
        EloCalculator eloCalc = new EloCalculator();
        int winnerNewElo = eloCalc.calculateSoloChange(first.getUniversity().getElo(), second.getUniversity().getElo(), true);
        int eloChange = winnerNewElo - first.getUniversity().getElo();

        return new SoloMatchReport(
                first.getUniversity().getPublicUniversityId(),
                second.getUniversity().getPublicUniversityId(),
                eloChange
        );
    }

    public SoloMatchReport chooseSoloMatch(UUID userUUID, UUID soloMatchUUID, UUID chosenUniversityUUID) {
        User user = userRepository.findByUserUUID(userUUID)
                .orElseThrow(() -> new RuntimeException("User not found with UUID: " + userUUID));

        SoloMatch soloMatch = soloMatchRepository.findByMatchUUID(soloMatchUUID)
                .orElseThrow(() -> new RuntimeException("Solo match not found with UUID: " + soloMatchUUID));

        if (!soloMatch.getOwnerUUID().equals(user.getUserUUID())) {
            throw new RuntimeException("User is not the owner of this solo match");
        }

        if (soloMatch.getStatus() != Status.PENDING) {
            throw new RuntimeException("Solo match is not pending");
        }

        University winner;
        University loser;

        if (soloMatch.getUniversityA().getPublicUniversityId().equals(chosenUniversityUUID)) {
            winner = soloMatch.getUniversityA();
            loser = soloMatch.getUniversityB();
        } else if (soloMatch.getUniversityB().getPublicUniversityId().equals(chosenUniversityUUID)) {
            winner = soloMatch.getUniversityB();
            loser = soloMatch.getUniversityA();
        } else {
            throw new RuntimeException("Chosen university is not part of this solo match");
        }

        EloCalculator eloCalc = new EloCalculator();
        int winnerEloNew = eloCalc.calculateSoloChange(winner.getElo(), loser.getElo(), true);
        int loserEloNew = eloCalc.calculateSoloChange(loser.getElo(), winner.getElo(), false);

        int eloChange = winnerEloNew - winner.getElo();

        winner.setElo(winnerEloNew);
        loser.setElo(loserEloNew);
        universityRepository.save(winner);
        universityRepository.save(loser);

        soloMatch.setWinner(winner);
        soloMatch.setLoser(loser);
        soloMatch.setEloChange(eloChange);
        soloMatch.setStatus(Status.FINISHED);
        soloMatch.setEndDate(Instant.now());
        soloMatchRepository.save(soloMatch);

        // Auto-create next solo match for user
        // matchmakingService.startNewDuel(user, false);

        return new SoloMatchReport(
                winner.getPublicUniversityId(),
                loser.getPublicUniversityId(),
                eloChange
        );
    }
}
