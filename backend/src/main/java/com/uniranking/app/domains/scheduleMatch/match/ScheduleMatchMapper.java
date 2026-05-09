package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantMapper;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = { ScheduleParticipantMapper.class })
public abstract class ScheduleMatchMapper {

    @Autowired
    protected UniversityRepository universityRepository;

    // Request -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicMatchId", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "status", constant = "NOT_STARTED")
    public abstract ScheduleMatch toScheduleMatch(ScheduleMatchRequest request);

    // Entity -> Response
    @Mapping(source = "id", target = "id")
    @Mapping(source = "participants", target = "participants")
    public abstract ScheduleMatchResponse toScheduleMatchResponse(ScheduleMatch match);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicMatchId", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "status", ignore = true)
    public abstract void updateMatchFromRequest(ScheduleMatchRequest request, @MappingTarget ScheduleMatch match);
}