package com.xhdh.xhdh.services;

import com.xhdh.xhdh.dto.VoteResponse;
import com.xhdh.xhdh.models.Vote;
import com.xhdh.xhdh.repositories.VoteRepository;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class VoteService {
    private VoteRepository voteRepository;

    public List<VoteResponse> findAll() {
        List<Vote> votes = voteRepository.findAll();
        List<VoteResponse> responses = new ArrayList<>();
        for (Vote vote : votes) {
            responses.add(new VoteResponse(vote));
        }
        return responses;
    }

}
