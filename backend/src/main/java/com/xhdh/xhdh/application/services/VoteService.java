package com.xhdh.xhdh.application.services;


import com.xhdh.xhdh.application.dto.votes.VoteRequest;
import com.xhdh.xhdh.application.dto.votes.VoteResponse;
import com.xhdh.xhdh.domain.models.*;
import com.xhdh.xhdh.infrastructure.repositories.MatchParticipantRepository;
import com.xhdh.xhdh.infrastructure.repositories.MatchRepository;
import com.xhdh.xhdh.infrastructure.repositories.UniversityRepository;
import com.xhdh.xhdh.infrastructure.repositories.UserRepository;
import com.xhdh.xhdh.infrastructure.repositories.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;

    private final UserRepository userRepository;

    private final UniversityRepository universityRepository;

    private final MatchRepository matchRepository;

    private final MatchParticipantRepository  matchParticipantRepository;

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
    public VoteResponse createVote(VoteRequest voteRequest) {
        leaderboardService.vote(voteRequest.universityId());

        long userId = voteRequest.userId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long matchId = voteRequest.matchId();
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        long universityId = voteRequest.universityId();
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new RuntimeException("University not found"));

        if ("PENDING".equals(String.valueOf(match.getStatus()))) {
            matchParticipantRepository.addVoteToUniversity(universityId, matchId);
        }

        Vote newVote = Vote.builder()
                .user(user)
                .university(university)
                .match(match)
                .voteAt(Instant.now())
                .build();

        return new VoteResponse(voteRepository.save(newVote));
    }

}

