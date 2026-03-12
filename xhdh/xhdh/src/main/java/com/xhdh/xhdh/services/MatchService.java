package com.xhdh.xhdh.services;

import com.fasterxml.jackson.databind.deser.DataFormatReaders;
import com.xhdh.xhdh.dto.MatchRequest;
import com.xhdh.xhdh.dto.MatchResponse;
import com.xhdh.xhdh.repositories.MatchRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Getter
@Setter
@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;

    public MatchResponse createMatch(MatchRequest matchRequest) {
        int universityId = matchRequest.getUniversityId();
        String tag = matchRequest.getTag();
        DataFormatReaders.Match match = new DataFormatReaders.Match();
    }
}
