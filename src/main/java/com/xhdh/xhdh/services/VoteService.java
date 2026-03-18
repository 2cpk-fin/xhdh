package com.xhdh.xhdh.services;


import com.xhdh.xhdh.dto.VoteRequest;
import com.xhdh.xhdh.dto.VoteResponse;
import com.xhdh.xhdh.models.*;
import com.xhdh.xhdh.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;

    private final UserRepository userRepository;

    private final UniversityRepository universityRepository;

    private final TagRepository tagRepository;

    private final MatchRepository matchRepository;

    private final MatchParticipantRepository  matchParticipantRepository;

    public ResponseEntity<List<VoteResponse>> findAllUserVotes(String username) {
        List<VoteResponse> voteResponses = new ArrayList<>();

        for (Vote vote : voteRepository.findAll()) {
            if (vote.getUser().getUsername().equals(username)) {
                voteResponses.add(new VoteResponse(vote));
            }
        }

        if (voteResponses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(voteResponses, HttpStatus.OK);
    }

    public ResponseEntity<List<VoteResponse>> findAllUniversityVotes(String universityName) {
        List<VoteResponse> voteResponses = new ArrayList<>();

        for (Vote vote : voteRepository.findAll()) {
            if (vote.getUniversity().getName().equals(universityName)) {
                voteResponses.add(new VoteResponse(vote));
            }
        }

        if (voteResponses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(voteResponses, HttpStatus.OK);
    }
    public ResponseEntity<VoteResponse> createVote(VoteRequest voteRequest) {
        long userId = voteRequest.getUserId();
        long universityId = voteRequest.getUniversityId();
        long tagId = voteRequest.getTagId();
        long matchId = voteRequest.getMatchId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new RuntimeException("University not found"));

        Tag tag =  tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        Vote newVote = new Vote();
        newVote.setUser(user);
        newVote.setUniversity(university);
        newVote.setTag(tag);
        newVote.setMatch(match);
        newVote.setVoteAt(LocalDateTime.now());

        voteRepository.save(newVote);

        matchParticipantRepository.addVoteToUniversity(universityId, matchId);

        return new ResponseEntity<>(new VoteResponse(newVote), HttpStatus.CREATED);
    }
}
