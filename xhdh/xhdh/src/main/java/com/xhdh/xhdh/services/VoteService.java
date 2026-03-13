package com.xhdh.xhdh.services;
/* 
import com.xhdh.xhdh.dto.VoteRequest;
*/
import com.xhdh.xhdh.dto.VoteResponse;
import com.xhdh.xhdh.models.Vote;
import com.xhdh.xhdh.repositories.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoteService {
    private VoteRepository voteRepository;

    public ResponseEntity<List<VoteResponse>> findAllUserVotes(String username) {
        List<VoteResponse> voteResponses = new ArrayList<>();

        for (Vote vote : voteRepository.findAll()) {
            if (vote.getUser().getUsername().equals(username)) {
                voteResponses.add(new VoteResponse(vote));
            }
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
        return new ResponseEntity<>(voteResponses, HttpStatus.OK);
    }
    /* 
    public ResponseEntity<VoteResponse> createVote(VoteRequest voteRequest) {
        Vote newVote = new Vote();
    }
    */
}
