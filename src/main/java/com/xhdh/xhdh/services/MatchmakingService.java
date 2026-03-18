package com.xhdh.xhdh.services;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.xhdh.xhdh.models.Status;
import org.springframework.stereotype.Service;

import com.xhdh.xhdh.dto.MatchResponseDTO;
import com.xhdh.xhdh.dto.UniversityDTO;
import com.xhdh.xhdh.exceptions.NotEnoughUniException;
import com.xhdh.xhdh.models.Match;
import com.xhdh.xhdh.models.MatchParticipant;
import com.xhdh.xhdh.models.University;
import com.xhdh.xhdh.models.User;
import com.xhdh.xhdh.repositories.MatchParticipantRepository;
import com.xhdh.xhdh.repositories.MatchRepository;
import com.xhdh.xhdh.repositories.UniversityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchmakingService {
    private final UniversityRepository universityRepository;
    private final MatchRepository matchRepository;
    private final MatchParticipantRepository matchParticipantRepository;
    
    public MatchResponseDTO startNewDuel(User user, boolean isScheduled){
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
        match.setStartTime(LocalDateTime.now());
        match.setEndTime(LocalDateTime.now().plusDays(7)); // Will be set when match ends
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
            savedMatch.getId(),
            savedMatch.getTitle(),
            savedMatch.getStatus(),
            savedMatch.getStartTime(),
            savedMatch.getEndTime(),
            new UniversityDTO((long) uA.getId(), uA.getName(), uA.getAbbreviation(), uA.getElo()),
            new UniversityDTO((long) uB.getId(), uB.getName(), uB.getAbbreviation(), uB.getElo())
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
}
