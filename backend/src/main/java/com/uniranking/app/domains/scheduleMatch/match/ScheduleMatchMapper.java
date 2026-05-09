package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = { ScheduleParticipantMapper.class })
public interface ScheduleMatchMapper {

    // Request -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicMatchId", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "status", constant = "NOT_STARTED")
    ScheduleMatch toScheduleMatch(ScheduleMatchRequest request);

    // Entity -> Response
    @Mapping(source = "id", target = "id")
    @Mapping(source = "participants", target = "participants")
    ScheduleMatchResponse toScheduleMatchResponse(ScheduleMatch match);

    // Update Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicMatchId", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateMatchFromRequest(ScheduleMatchRequest request, @MappingTarget ScheduleMatch match);
}