package com.xhdh.xhdh.controllers;

import com.xhdh.xhdh.dto.VoteRequest;
import com.xhdh.xhdh.dto.VoteResponse;
import com.xhdh.xhdh.services.VoteService;
import lombok.RequiredArgsConstructor;
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
        return voteService.findAllUserVotes(username);
    }

    @GetMapping(path = "/university/{university}")
    public ResponseEntity<List<VoteResponse>> findAllUniversityVotes(@PathVariable String university) {
        return voteService.findAllUniversityVotes(university);
    }

    @PostMapping
    public ResponseEntity<VoteResponse> createVote(@RequestBody VoteRequest voteRequest) {
        return voteService.createVote(voteRequest);
    }
}
