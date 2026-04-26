package com.uniranking.app.domains.scheduleMatch.participant;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.uniranking.app.domains.searching.university.UniversityResponse;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({ "university", "totalVotes", "rank" })
public class ScheduleParticipantResponse {
    private UniversityResponse universityResponse;
    private long totalVotes;
    private int rank;
}
