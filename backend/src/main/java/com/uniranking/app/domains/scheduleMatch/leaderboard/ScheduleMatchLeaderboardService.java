package com.uniranking.app.domains.scheduleMatch.leaderboard;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import java.util.List;

public interface ScheduleMatchLeaderboardService {
    List<ScheduleParticipantResponse> showLeaderboard(String publicMatchId);
}