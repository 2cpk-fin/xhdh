package com.xhdh.xhdh.application.services;


import com.xhdh.xhdh.application.dto.votes.VoteRequest;
import com.xhdh.xhdh.application.dto.votes.VoteResponse;
import com.xhdh.xhdh.infrastructure.repositories.jpa.VoteRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
public class VoteService {
    public final VoteRepository voteRepository;

    private final VotePersistenceService votePersistenceService;

    private final EventLeaderboardService eventLeaderboardService;

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
        eventLeaderboardService.vote(voteRequest.universityId(), String.valueOf(voteRequest.matchId()));

        votePersistenceService.asyncVote(voteRequest);

        return "Success";
    }

}

