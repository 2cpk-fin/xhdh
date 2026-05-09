package com.uniranking.app.domains.scheduleMatch.match;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleMatchRedisPort {
    void initializeMatch(String publicMatchId, LocalDateTime startTime, List<Long> participantIds);
    String getMatchStatus(String publicMatchId);
    Long getUserVote(String publicMatchId, String userId);
    void recordNewVote(String publicMatchId, String userId, Long universityId);
    void changeVote(String publicMatchId, String userId, Long oldUniversityId, Long newUniversityId);
}