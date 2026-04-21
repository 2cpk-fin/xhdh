package com.uniranking.app.domains.scheduleMatch.participant;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ScheduleParticipantMapper {
    @Mapping(source = "publicParticipantId", target = "id")
    @Mapping(source = "university.name", target = "universityName")
    ScheduleParticipantResponse toScheduleParticipantResponse(ScheduleParticipant participant);
}
