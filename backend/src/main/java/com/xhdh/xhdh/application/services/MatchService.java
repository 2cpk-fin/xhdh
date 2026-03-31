package com.xhdh.xhdh.application.services;

import com.xhdh.xhdh.application.dto.matches.MatchParticipantResponse;
import com.xhdh.xhdh.application.dto.matches.MatchRequest;
import com.xhdh.xhdh.application.dto.matches.SoloMatchReport;
import com.xhdh.xhdh.application.dto.matches.MatchResponse;
import com.xhdh.xhdh.domain.models.Match;
import com.xhdh.xhdh.domain.models.SoloMatch;
import com.xhdh.xhdh.domain.models.User;
import com.xhdh.xhdh.domain.models.MatchParticipant;
import com.xhdh.xhdh.domain.models.Status;
import com.xhdh.xhdh.domain.models.University;
import com.xhdh.xhdh.application.utilities.EloCalculator;
import com.xhdh.xhdh.infrastructure.repositories.jpa.MatchParticipantRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.MatchRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.SoloMatchRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UniversityRepository;
import com.xhdh.xhdh.infrastructure.repositories.jpa.UserRepository;

import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
@Setter
@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;

    private final MatchParticipantRepository matchParticipantRepository;

    private final UniversityRepository universityRepository;

    private final SoloMatchRepository soloMatchRepository;

    private final UserRepository userRepository;

    private final MatchmakingService matchmakingService;

    private final RedisTemplate<String, Object> redisTemplate;

    private Match buildMatch(MatchRequest matchRequest) {
        Match newMatch = Match.builder()
                .title(matchRequest.getTitle())
                .status(Status.NOT_STARTED)
                .startTime(matchRequest.getStartTime())
                .endTime(matchRequest.getEndTime())
                .build();

        // Then, we will build the Participant
        List<MatchParticipant> participants = matchRequest.getParticipants()
                .stream()
                .map(universityName -> {
                    MatchParticipant participant = new MatchParticipant();
                    participant.setMatch(newMatch);
                    participant.setUniversity(universityRepository.findByName(universityName));
                    return participant;
                })
                .collect(Collectors.toList());

        // And set to Match
        if (participants.size() < 2) {
            throw new RuntimeException("Not enough participants for this match");
        }
        newMatch.setParticipants(participants);

        return newMatch;
    }

    private MatchResponse buildMatchResponse(Match match) {
        return MatchResponse.builder()
                .id(match.getId())
                .title(match.getTitle())
                .status(String.valueOf(match.getStatus()))
                .participants(buildParticipantResponses(match))
                .startTime(match.getStartTime())
                .endTime(match.getEndTime())
                .build();
    }

    private List<MatchParticipantResponse> buildParticipantResponses(Match match) {
        return match.getParticipants()
                .stream()
                .map(MatchParticipantResponse::new)
                .toList();
    }

    private void updateEloToParticipants(Match match) {
        int minRank = 1000;
        List<University> universityList = new ArrayList<>();

        for (MatchParticipant participant : match.getParticipants()) {
            minRank = Math.min(minRank, participant.getRank());
            universityList.add(participant.getUniversity());
        }

        // Algo in here
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    protected void changeStatus() {
        for (Match match : matchRepository.findAllNotFinishedMatch()) {
            Instant now = Instant.now();
            if (match.getEndTime().isAfter(now)) {
                match.setStatus(Status.FINISHED);
                updateEloToParticipants(match);
            }
            else if (match.getStartTime().isAfter(now)) {
                match.setStatus(Status.PENDING);
            }
        }
    }

    @Scheduled(fixedRate = 60000) // Check every minute for expired solo matches
    @Transactional
    protected void expireSoloMatches() {
        Instant now = Instant.now();
        List<SoloMatch> expiredMatches = soloMatchRepository.findAll().stream()
            .filter(match -> match.getStatus() == Status.PENDING && match.getEndDate().isBefore(now))
            .toList();

        for (SoloMatch soloMatch : expiredMatches) {
            soloMatch.setStatus(Status.FINISHED);
            soloMatch.setWinner(null);
            soloMatch.setLoser(null);
            soloMatch.setEloChange(0);
            soloMatchRepository.save(soloMatch);
        }
    }

    public List<MatchResponse> getAllMatches() {
        return matchRepository.findAll()
                .stream()
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<MatchResponse> getAllNotStartedMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "NOT_STARTED".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<MatchResponse> getAllPendingMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "PENDING".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<MatchResponse> getAllFinishedMatches() {
        return matchRepository.findAll()
                .stream()
                .filter(match -> "FINISHED".equals(String.valueOf(match.getStatus())))
                .map(this::buildMatchResponse)
                .toList();
    }

    public List<MatchParticipantResponse> getAllParticipants(long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        return  match.getParticipants()
                .stream()
                .map(MatchParticipantResponse::new)
                .toList();
    }

    public MatchResponse createMatch(MatchRequest matchRequest) {
        return buildMatchResponse(matchRepository.save(buildMatch(matchRequest)));
    }

    public MatchResponse updateMatchById(long id, MatchRequest matchRequest) {
        Match newMatch = buildMatch(matchRequest);
        newMatch.setId(id);
        return buildMatchResponse(matchRepository.save(newMatch));
    }

    public String deleteMatchById(long id) {
        matchRepository.deleteById(id);
        return "The match with id " + id + " has been deleted";
    }

    /**
     * Decides winner and loser based on votes in the match.
     * Returns SoloMatchReport with winner and loser UUIDs and ELO change amount.
     * If no clear winner is decided, returns SoloMatchReport with null winnerId/loserId and 0 eloChange.
     */
    public SoloMatchReport decideWinnerAndLoser(Match match) {
        List<MatchParticipant> participants = match.getParticipants();
        
        if (participants.isEmpty() || participants.size() < 2) {
            return new SoloMatchReport(null, null, 0);
        }

        // Sort participants by total votes in descending order
        participants.sort((p1, p2) -> Long.compare(p2.getTotalVotes(), p1.getTotalVotes()));

        MatchParticipant first = participants.get(0);
        MatchParticipant second = participants.get(1);

        // If votes are equal or first has no votes, no decision
        if (first.getTotalVotes() == 0 || first.getTotalVotes() == second.getTotalVotes()) {
            return new SoloMatchReport(null, null, 0);
        }

        // Calculate ELO change using EloCalculator
        EloCalculator eloCalc = new EloCalculator();
        int winnerNewElo = eloCalc.calculateSoloChange(first.getUniversity().getElo(), second.getUniversity().getElo(), true);
        int eloChange = winnerNewElo - first.getUniversity().getElo();

        return new SoloMatchReport(
            first.getUniversity().getPublicUniversityId(),
            second.getUniversity().getPublicUniversityId(),
            eloChange
        );
    }

    public SoloMatchReport chooseSoloMatch(UUID userUUID, UUID soloMatchUUID, UUID chosenUniversityUUID) {
        User user = userRepository.findByUserUUID(userUUID)
                .orElseThrow(() -> new RuntimeException("User not found with UUID: " + userUUID));

        SoloMatch soloMatch = soloMatchRepository.findByMatchUUID(soloMatchUUID)
                .orElseThrow(() -> new RuntimeException("Solo match not found with UUID: " + soloMatchUUID));

        if (!soloMatch.getOwnerUUID().equals(user.getUserUUID())) {
            throw new RuntimeException("User is not the owner of this solo match");
        }

        if (soloMatch.getStatus() != Status.PENDING) {
            throw new RuntimeException("Solo match is not pending");
        }

        University winner;
        University loser;

        if (soloMatch.getUniversityA().getPublicUniversityId().equals(chosenUniversityUUID)) {
            winner = soloMatch.getUniversityA();
            loser = soloMatch.getUniversityB();
        } else if (soloMatch.getUniversityB().getPublicUniversityId().equals(chosenUniversityUUID)) {
            winner = soloMatch.getUniversityB();
            loser = soloMatch.getUniversityA();
        } else {
            throw new RuntimeException("Chosen university is not part of this solo match");
        }

        EloCalculator eloCalc = new EloCalculator();
        int winnerEloNew = eloCalc.calculateSoloChange(winner.getElo(), loser.getElo(), true);
        int loserEloNew = eloCalc.calculateSoloChange(loser.getElo(), winner.getElo(), false);

        int eloChange = winnerEloNew - winner.getElo();

        winner.setElo(winnerEloNew);
        loser.setElo(loserEloNew);
        universityRepository.save(winner);
        universityRepository.save(loser);

        soloMatch.setWinner(winner);
        soloMatch.setLoser(loser);
        soloMatch.setEloChange(eloChange);
        soloMatch.setStatus(Status.FINISHED);
        soloMatch.setEndDate(Instant.now());
        soloMatchRepository.save(soloMatch);

        // Auto-create next solo match for user
        // matchmakingService.startNewDuel(user, false);

        return new SoloMatchReport(
                winner.getPublicUniversityId(),
                loser.getPublicUniversityId(),
                eloChange
        );
    }
}
