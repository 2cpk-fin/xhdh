package com.xhdh.xhdh.presentation.controllers.votes;

import com.xhdh.xhdh.application.dto.votes.VoteRequest;
import com.xhdh.xhdh.application.dto.votes.VoteResponse;
import com.xhdh.xhdh.application.services.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/votes")
@RequiredArgsConstructor
public class VoteController {
    private final VoteService voteService;

    @GetMapping(path = "/user/{username}")
    public ResponseEntity<List<VoteResponse>> findAllUserVotes(@PathVariable String username) {
        return new ResponseEntity<>(voteService.findAllUserVotes(username), HttpStatus.OK);
    }

    @GetMapping(path = "/university/{university}")
    public ResponseEntity<List<VoteResponse>> findAllUniversityVotes(@PathVariable String university) {
        return new ResponseEntity<>(voteService.findAllUniversityVotes(university), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> createVote(@RequestBody VoteRequest voteRequest) {
        return new ResponseEntity<>(voteService.createVote(voteRequest), HttpStatus.CREATED);
    }

}
