package com.uniranking.app.domains.scheduleMatch.participant;

import com.uniranking.app.domains.searching.university.UniversityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ScheduleParticipantMapper {
    @Autowired
    private UniversityMapper universityMapper;

    public ScheduleParticipantResponse toScheduleParticipantResponse(ScheduleParticipant participant) {
        ScheduleParticipantResponse scheduleParticipantResponse = new ScheduleParticipantResponse();

        scheduleParticipantResponse.setUniversityResponse(universityMapper.mapToResponseWithTags(participant.getUniversity()));
        scheduleParticipantResponse.setTotalVotes(participant.getTotalVotes());
        scheduleParticipantResponse.setRank(participant.getRank());

        return scheduleParticipantResponse;
    }
}
