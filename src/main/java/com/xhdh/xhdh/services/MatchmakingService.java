package com.xhdh.xhdh.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.xhdh.xhdh.dto.MatchParticipantResponse;
import com.xhdh.xhdh.models.User;
import com.xhdh.xhdh.repositories.MatchRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchmakingService {
    private final MatchRepository matchRepository;
    
    public ResponseEntity<MatchParticipantResponse>startNewDuel(User user, boolean isScheduled){
        
    }
}
