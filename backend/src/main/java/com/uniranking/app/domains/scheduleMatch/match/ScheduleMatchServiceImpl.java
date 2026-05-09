package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.exceptions.*;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipant;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantMapper;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import com.uniranking.app.domains.searching.exceptions.UniversityNotFoundException;
import com.uniranking.app.domains.searching.university.UniversityRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleMatchServiceImpl implements ScheduleMatchService {
    private final ScheduleMatchRepository scheduleMatchRepository;
    private final UniversityRepository universityRepository;

    private final ScheduleMatchMapper scheduleMatchMapper;
    private final ScheduleParticipantMapper scheduleParticipantMapper;

    private final ScheduleMatchRedisPort scheduleMatchRedisPort;

    private void buildMatchInRedis(ScheduleMatchRequest request, ScheduleMatch scheduleMatch) {
        scheduleMatchRedisPort.initializeMatch(
                String.valueOf(scheduleMatch.getPublicMatchId()),
                request.getStartTime(),
                request.getUniIds()
        );
    }

    @Override
    @CacheEvict(value = "leaderboard", key = "#publicMatchId")
    public void vote(Long universityId, String publicMatchId, Authentication authentication) {
        // Validate the match status for voting
        String currentStatus = scheduleMatchRedisPort.getMatchStatus(publicMatchId);

        if (currentStatus == null) {
            throw new MatchNotFoundException("Match not found or already finished");
        }
        else if (Status.NOT_STARTED.name().equals(currentStatus)) {
            throw new MatchNotStartedException("Match has not started yet");
        }

        // Get existing vote
        String userId = authentication.getName();
        Long oldUniversityId = scheduleMatchRedisPort.getUserVote(publicMatchId, userId);

        if (oldUniversityId == null) {
            // First time voting
            scheduleMatchRedisPort.recordNewVote(publicMatchId, userId, universityId);
        }
        else if (!oldUniversityId.equals(universityId)) {
            scheduleMatchRedisPort.changeVote(publicMatchId, userId, oldUniversityId, universityId);
        }
        else {
            throw new DuplicateVoteException("You already voted for this university!");
        }
    }

    @Override
    public Page<ScheduleMatchResponse> getAllMatches(int pageNo, int size) {
        return scheduleMatchRepository.findAll(PageRequest.of(pageNo, size))
                .map(scheduleMatchMapper::toScheduleMatchResponse);
    }

    @Override
    public List<ScheduleMatchResponse> getAllNotStartedMatches() {
        return scheduleMatchRepository.findAllNotStartedMatch()
                .stream()
                .map(scheduleMatchMapper::toScheduleMatchResponse)
                .toList();
    }

    @Override
    public List<ScheduleMatchResponse> getAllPendingMatches() {
        return scheduleMatchRepository.findAllPendingMatch()
                .stream()
                .map(scheduleMatchMapper::toScheduleMatchResponse)
                .toList();
    }

    @Override
    public List<ScheduleMatchResponse> getAllFinishedMatches() {
        return scheduleMatchRepository.findAllFinishedMatch()
                .stream()
                .map(scheduleMatchMapper::toScheduleMatchResponse)
                .toList();
    }

    @Override
    public List<ScheduleParticipantResponse> getAllParticipants(long id) {
        ScheduleMatch scheduleMatch = scheduleMatchRepository.findById(id)
                .orElseThrow(() -> new MatchNotFoundException("Match not found"));

        return scheduleMatch.getParticipants()
                .stream()
                .map(scheduleParticipantMapper::toScheduleParticipantResponse)
                .toList();
    }

    // For admin
    @Override
    @Transactional
    public ScheduleMatchResponse createMatch(ScheduleMatchRequest scheduleMatchRequest) {
        // Validate the time
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = scheduleMatchRequest.getStartTime();
        LocalDateTime endTime = scheduleMatchRequest.getEndTime();

        if (startTime.isBefore(now)) {
            throw new InvalidMatchTimeException("Start time must be at least later than the current time.");
        }
        if (endTime.isBefore(startTime.plusDays(1))) {
            throw new InvalidMatchTimeException("End time must be at least 1 day after the start time.");
        }

        // Create match without participants (mapper ignores them)
        ScheduleMatch newScheduleMatch = scheduleMatchMapper.toScheduleMatch(scheduleMatchRequest);

        // Explicitly create and associate participants
        List<ScheduleParticipant> participants = new ArrayList<>();
        if (scheduleMatchRequest.getUniIds() != null && !scheduleMatchRequest.getUniIds().isEmpty()) {
            for (Long uniId : scheduleMatchRequest.getUniIds()) {
                ScheduleParticipant participant = new ScheduleParticipant();
                participant.setScheduleMatch(newScheduleMatch);
                participant.setUniversity(universityRepository.findById(uniId)
                        .orElseThrow(
                                () -> new UniversityNotFoundException("University with id " + uniId + " not found")));
                participants.add(participant);
            }
        }

        if (participants.size() < 2) {
            throw new InvalidParticipantCountException("A match must have at least 2 participants");
        }

        newScheduleMatch.setParticipants(participants);
        scheduleMatchRepository.save(newScheduleMatch);
        buildMatchInRedis(scheduleMatchRequest, newScheduleMatch);

        return scheduleMatchMapper.toScheduleMatchResponse(newScheduleMatch);
    }

    @Override
    public ScheduleMatchResponse updateMatchById(long id, ScheduleMatchRequest scheduleMatchRequest) {
        ScheduleMatch existingMatch = findMatchById(id);
        scheduleMatchMapper.updateMatchFromRequest(scheduleMatchRequest, existingMatch);
        ScheduleMatch savedMatch = scheduleMatchRepository.save(existingMatch);
        return scheduleMatchMapper.toScheduleMatchResponse(savedMatch);
    }

    @Override
    public String deleteMatchById(long id) {
        ScheduleMatch existingMatch = findMatchById(id);
        scheduleMatchRepository.delete(existingMatch);
        return "The match with id " + id + " has been deleted";
    }

    private ScheduleMatch findMatchById(long id) {
        return scheduleMatchRepository.findById(id)
                .orElseThrow(() -> new MatchNotFoundException("Match not found with id: " + id));
    }
}