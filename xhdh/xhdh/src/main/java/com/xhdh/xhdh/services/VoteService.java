package com.xhdh.xhdh.services;


import com.xhdh.xhdh.dto.VoteRequest;
import com.xhdh.xhdh.dto.VoteResponse;
import com.xhdh.xhdh.models.*;
import com.xhdh.xhdh.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
        User user = userRepository.findById(voteRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        University university = universityRepository.findById(voteRequest.getUniversityId())
                .orElseThrow(() -> new RuntimeException("University not found"));

        Tag tag =  tagRepository.findById(voteRequest.getTagId())
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        Match match = matchRepository.findById(voteRequest.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        Vote newVote = new Vote();
        newVote.setUser(user);
        newVote.setUniversity(university);
        newVote.setTag(tag);
        newVote.setMatch(match);

        voteRepository.save(newVote);
        return new ResponseEntity<>(new VoteResponse(newVote), HttpStatus.CREATED);
    }
}
