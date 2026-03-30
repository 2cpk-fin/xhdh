package com.xhdh.xhdh.application.services;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.xhdh.xhdh.domain.models.Status;
import org.springframework.stereotype.Service;

import com.xhdh.xhdh.application.dto.matches.MatchResponseDTO;
import com.xhdh.xhdh.application.dto.searches.UniversityDTO;
import com.xhdh.xhdh.presentation.exceptions.NotEnoughUniException;
import com.xhdh.xhdh.domain.models.Match;
import com.xhdh.xhdh.domain.models.MatchParticipant;
import com.xhdh.xhdh.domain.models.SoloMatch;
import com.xhdh.xhdh.domain.models.University;
import com.xhdh.xhdh.domain.models.User;
import com.xhdh.xhdh.infrastructure.repositories.jpa.MatchParticipantRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.MatchRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.SoloMatchRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UniversityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchmakingService {
    private final UniversityRepository universityRepository;
    private final MatchRepository matchRepository;
    private final MatchParticipantRepository matchParticipantRepository;
    private final SoloMatchRepository soloMatchRepository;
    
    public MatchResponseDTO startNewDuel1(User user, boolean isScheduled){
        University uA = universityRepository.findRandom();
        // DEBUG : System.out.println("University A: " + uA.getAbbreviation());
        List<University> candidates = universityRepository.findAllOpponentsWithSharedTag(uA.getId());
        // DEBUG : System.out.println("Candidates found: " + candidates.size());
        candidates.removeIf(u -> u.getId() == uA.getId()); // Remove self from candidates
        if (candidates.isEmpty()){
            throw new NotEnoughUniException("Not enough universities to match");
        }

        University uB = selectWeightedOpponent(uA, candidates);
        
        // Create the match
        Match match = new Match();
        match.setTitle(uA.getAbbreviation() + " vs " + uB.getAbbreviation());
        match.setStatus(Status.PENDING);
        match.setStartTime(Instant.now());
        match.setEndTime(Instant.now().plusSeconds(7 * 24 * 60 * 60)); // Will be set when match ends
        Match savedMatch = matchRepository.save(match);

        // Create match participants
        MatchParticipant participantA = new MatchParticipant();
        participantA.setMatch(savedMatch);
        participantA.setUniversity(uA);
        participantA.setTotalVotes(0);
        participantA.setRank(0);
        matchParticipantRepository.save(participantA);
        
        MatchParticipant participantB = new MatchParticipant();
        participantB.setMatch(savedMatch);
        participantB.setUniversity(uB);
        participantB.setTotalVotes(0);
        participantB.setRank(0);
        matchParticipantRepository.save(participantB);    

        return new MatchResponseDTO(
            savedMatch.getPublicMatchId(),
            savedMatch.getTitle(),
            savedMatch.getStatus(),
            savedMatch.getStartTime(),
            savedMatch.getEndTime(),
            new UniversityDTO(uA.getPublicUniversityId(), uA.getName(), uA.getAbbreviation(), uA.getElo()),
            new UniversityDTO(uB.getPublicUniversityId(), uB.getName(), uB.getAbbreviation(), uB.getElo()),
            user.getUserUUID()
        );
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
    return candidates.get(0);
}

    /**
     * Starts a new solo match by generating 2 random universities for the user to choose from.
     * Creates a SoloMatch entity with PENDING status and 3-minute duration.
     * Returns MatchResponseDTO with the two universities and ownerUUID.
     */
    public MatchResponseDTO startNewDuel(User user, boolean isScheduled) {
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
}
