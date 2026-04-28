package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantRepository;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.*;

@Component
@RequiredArgsConstructor
public class AfterMatchCalculator {
    private final ScheduleMatchRepository scheduleMatchRepository;
    private final ScheduleParticipantRepository scheduleParticipantRepository;
    private final UniversityRepository universityRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Transactional
    public void afterMatchCalculation(String publicMatchId, String leaderboardKey) {
        Set<ZSetOperations.TypedTuple<Object>> results =
                redisTemplate.opsForZSet().reverseRangeWithScores(leaderboardKey, 0, -1);
        if (results == null || results.isEmpty()) return;

        ScheduleMatch match = scheduleMatchRepository.findByPublicMatchId(UUID.fromString(publicMatchId));
        if (match == null) return;

        List<ZSetOperations.TypedTuple<Object>> list = new ArrayList<>(results);

        syncTotalVotes(match.getId(), list);
        syncRank(match.getId(), list);
        processEloGroups(list);

        // Delete the leaderboard key only after the transaction commits successfully.
        // If the DB rolls back, the key is preserved for a retry.
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        redisTemplate.delete(leaderboardKey);
                    }
                }
        );
    }

    private void syncTotalVotes(Long matchId, List<ZSetOperations.TypedTuple<Object>> results) {
        for (var entry : results) {
            long universityId = getUniversityId(entry);
            long totalVotes = (long) (entry.getScore() != null ? entry.getScore() : 0.0);
            scheduleParticipantRepository.updateTotalVotes(universityId, matchId, totalVotes);
        }
    }

    private void syncRank(Long matchId, List<ZSetOperations.TypedTuple<Object>> results) {
        for (int i = 0; i < results.size(); i++) {
            long universityId = getUniversityId(results.get(i));
            scheduleParticipantRepository.updateRank(universityId, matchId, i + 1);
        }
    }

    private void processEloGroups(List<ZSetOperations.TypedTuple<Object>> list) {
        int total = list.size();
        int groupSize = total / 3;
        int extra = total % 3;

        int endGroup1 = groupSize + (extra > 0 ? 1 : 0);
        int endGroup2 = endGroup1 + groupSize + (extra > 1 ? 1 : 0);

        syncElo(list.subList(0, endGroup1),        1.0);   // Top tier
        syncElo(list.subList(endGroup1, endGroup2), 0.5);  // Middle tier — floor reward added
        syncElo(list.subList(endGroup2, total),    -1.0);  // Bottom tier
    }

    private void syncElo(List<ZSetOperations.TypedTuple<Object>> group, double modifier) {
        if (group.isEmpty()) return;

        double baseReward = 20.0;
        double sigmaV = group.stream()
                .mapToDouble(t -> t.getScore() != null ? t.getScore() : 0.0)
                .sum();

        for (var tuple : group) {
            long universityId = getUniversityId(tuple);
            double vi = tuple.getScore() != null ? tuple.getScore() : 0.0;

            double voteFraction = (sigmaV == 0) ? 0 : vi / sigmaV;
            double eloChange = (voteFraction + modifier) * baseReward;

            applyEloToUniversity(universityId, (int) Math.round(eloChange));
        }
    }

    private void applyEloToUniversity(long universityId, int eloChange) {
        universityRepository.findById(universityId).ifPresent(u -> {
            u.setElo(u.getElo() + eloChange);
            universityRepository.save(u);
        });
    }

    private long getUniversityId(ZSetOperations.TypedTuple<Object> tuple) {
        return Long.parseLong(Objects.requireNonNull(tuple.getValue()).toString());
    }
}