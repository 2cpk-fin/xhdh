package com.xhdh.xhdh.services;


import com.xhdh.xhdh.dto.VoteRequest;
import com.xhdh.xhdh.dto.VoteResponse;
import com.xhdh.xhdh.models.*;
import com.xhdh.xhdh.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;

    private final UserRepository userRepository;

    private final UniversityRepository universityRepository;

    private final MatchRepository matchRepository;

    private final MatchParticipantRepository  matchParticipantRepository;

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

    public VoteResponse createVote(VoteRequest voteRequest) {
        long userId = voteRequest.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long matchId = voteRequest.getMatchId();
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        long universityId = voteRequest.getUniversityId();
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new RuntimeException("University not found"));

        if ("PENDING".equals(String.valueOf(match.getStatus()))) {
            matchParticipantRepository.addVoteToUniversity(universityId, matchId);
        }

        Vote newVote = Vote.builder()
                .user(user)
                .university(university)
                .match(match)
                .voteAt(LocalDateTime.now())
                .build();

        return new VoteResponse(voteRepository.save(newVote));
    }
}
