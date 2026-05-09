package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantResponse;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import java.util.List;

public interface ScheduleMatchService {

    void vote(Long universityId, String publicMatchId, Authentication authentication);

    Page<ScheduleMatchResponse> getAllMatches(int pageNo, int size);

    List<ScheduleMatchResponse> getAllNotStartedMatches();

    List<ScheduleMatchResponse> getAllPendingMatches();

    List<ScheduleMatchResponse> getAllFinishedMatches();

    List<ScheduleParticipantResponse> getAllParticipants(long id);

    ScheduleMatchResponse createMatch(ScheduleMatchRequest scheduleMatchRequest);

    ScheduleMatchResponse updateMatchById(long id, ScheduleMatchRequest scheduleMatchRequest);

    String deleteMatchById(long id);
}