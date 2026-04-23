package com.uniranking.app.domains.scheduleMatch.participant;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ScheduleParticipantMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "publicParticipantId", target = "publicUniversityId")
    @Mapping(source = "university.name", target = "universityName")
    ScheduleParticipantResponse toScheduleParticipantResponse(ScheduleParticipant participant);
}
