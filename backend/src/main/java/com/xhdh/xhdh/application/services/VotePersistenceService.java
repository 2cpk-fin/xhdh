package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.application.dto.votes.VoteRequest;
import com.xhdh.xhdh.domain.models.Match;
import com.xhdh.xhdh.domain.models.University;
import com.xhdh.xhdh.domain.models.User;
import com.xhdh.xhdh.domain.models.Vote;
import com.xhdh.xhdh.infrastructure.repositories.jpa.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class VotePersistenceService {
    private final VoteRepository voteRepository;

    private final UserRepository userRepository;

    private final UniversityRepository universityRepository;

    private final MatchRepository matchRepository;

    private final MatchParticipantRepository matchParticipantRepository;

    @Async
    @Transactional
    public void asyncVote(VoteRequest voteRequest) {
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

        voteRepository.save(newVote);
    }
}
