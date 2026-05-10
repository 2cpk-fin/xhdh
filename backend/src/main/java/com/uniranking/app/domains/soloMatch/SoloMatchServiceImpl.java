package com.uniranking.app.domains.soloMatch;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.uniranking.app.domains.searching.exceptions.UniversityNotFoundException;
import com.uniranking.app.domains.searching.university.*;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SoloMatchServiceImpl implements SoloMatchService {

    private final UniversityRepository universityRepository;
    private final UniversityMapper universityMapper;
    private final UniversityService universityService;

    private final EloCalculator eloCalc = new EloCalculator();

    @Override
    @Transactional
    public SoloMatchReport chooseWinner(Long winnerId, Long loserId) {

        List<University> universities = universityRepository.findAllById(List.of(winnerId, loserId));

        Map<Long, University> uniMap = universities.stream()
                .collect(Collectors.toMap(University::getId, u -> u));

        University winner = uniMap.get(winnerId);
        University loser = uniMap.get(loserId);

        if (winner == null) {
            throw new UniversityNotFoundException("Winning university not found with ID: " + winnerId);
        }
        if (loser == null) {
            throw new UniversityNotFoundException("Losing university not found with ID: " + loserId);
        }

        int winnerEloNew = eloCalc.calculateSoloChange(winner.getElo(), loser.getElo(), true);
        int winnerEloChange = winnerEloNew - winner.getElo();

        int loserEloNew = eloCalc.calculateSoloChange(loser.getElo(), winner.getElo(), false);
        int loserEloChange = loser.getElo() - loserEloNew;

        winner.setElo(winnerEloNew);
        loser.setElo(loserEloNew);

        universityRepository.saveAll(List.of(winner, loser));

        UniversityResponse winnerResponse = universityMapper.toUniversityResponse(winner);
        UniversityResponse loserResponse = universityMapper.toUniversityResponse(loser);

        universityService.cacheUniversity(winnerResponse);
        universityService.cacheUniversity(loserResponse);

        return new SoloMatchReport(winnerResponse, winnerEloChange, loserResponse, loserEloChange);
    }
}