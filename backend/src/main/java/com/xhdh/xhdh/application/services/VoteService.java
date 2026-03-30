package com.xhdh.xhdh.application.services;


import com.xhdh.xhdh.application.dto.votes.VoteRequest;
import com.xhdh.xhdh.application.dto.votes.VoteResponse;
import com.xhdh.xhdh.domain.models.*;
import com.xhdh.xhdh.infrastructure.repositories.jpa.MatchParticipantRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.MatchRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UniversityRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UserRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.VoteRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
@Service
@RequiredArgsConstructor
public class VoteService {
    public final VoteRepository voteRepository;

    private final VotePersistenceService votePersistenceService;

    private final LeaderboardService leaderboardService;

    public List<VoteResponse> findAllUserVotes(String username) {
        return voteRepository.findAllByUsername(username)
                .stream()
                .map(VoteResponse::new)
                .toList();
    }

    public List<VoteResponse> findAllUniversityVotes(String universityName) {
        return voteRepository.findAllByUniversityName(universityName)
                .stream()
                .map(VoteResponse::new)
                .toList();
    }

    @Transactional
    public String createVote(VoteRequest voteRequest) {
        leaderboardService.vote(voteRequest.universityId());

        votePersistenceService.asyncVote(voteRequest);

        return "Success";
    }

}

