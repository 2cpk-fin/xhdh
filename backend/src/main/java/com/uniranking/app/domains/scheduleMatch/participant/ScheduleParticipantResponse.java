package com.uniranking.app.domains.scheduleMatch.participant;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.uniranking.app.domains.searching.university.UniversityResponse;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({ "university", "totalVotes", "rank" })
public class ScheduleParticipantResponse {
    private UniversityResponse universityResponse;
    private long totalVotes;
    private int rank;
}
