package com.xhdh.xhdh.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.xhdh.xhdh.dto.MatchmakingResponse;
import com.xhdh.xhdh.exceptions.NotEnoughUniException;
import com.xhdh.xhdh.models.University;
import com.xhdh.xhdh.models.User;
import com.xhdh.xhdh.repositories.UniversityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchmakingService {
    private final UniversityRepository universityRepository;
    
    public MatchmakingResponse startNewDuel(User user,boolean isScheduled){
        University uA = universityRepository.findRandom();

        List<University> candidates = universityRepository.findAllOpponentsWithSharedTag(uA.getId());

        if (candidates.isEmpty()){
            throw new NotEnoughUniException("Not enough university to match");
        }

        University uB = selectWeightedOpponent(uA, candidates);
        return new MatchmakingResponse(uA,uB);
        
    }
    private University selectWeightedOpponent(University uA, List<University> candidates) {
        double totalWeight = 0;
        Map<University, Double> weights = new HashMap<>();

    for (University uB : candidates) {
        int eloDiff = Math.abs(uA.getElo() - uB.getElo());
        // Your logic: 1000 - difference (min weight 1 to avoid division by zero)
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
