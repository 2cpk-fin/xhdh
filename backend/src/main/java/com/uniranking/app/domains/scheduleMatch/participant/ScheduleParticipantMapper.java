package com.uniranking.app.domains.scheduleMatch.participant;

import com.uniranking.app.domains.searching.university.UniversityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { UniversityMapper.class })
public interface ScheduleParticipantMapper {

    @Mapping(source = "university", target = "universityResponse")
    ScheduleParticipantResponse toScheduleParticipantResponse(ScheduleParticipant participant);

}