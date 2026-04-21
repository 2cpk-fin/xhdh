package com.uniranking.app.domains.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipant;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantMapper;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

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
    @Mapping(source = "publicMatchId", target = "id")
    @Mapping(source = "participants", target = "participants")
    public abstract ScheduleMatchResponse toScheduleMatchResponse(ScheduleMatch match);

    @AfterMapping
    protected void linkParticipants(ScheduleMatchRequest request, @MappingTarget ScheduleMatch match) {
        if (request.getParticipants() == null) return;

        List<ScheduleParticipant> participants = request.getParticipants().stream()
                .map(name -> {
                    ScheduleParticipant p = new ScheduleParticipant();
                    p.setScheduleMatch(match);
                    p.setUniversity(universityRepository.findByName(name));
                    return p;
                }).toList();

        if (participants.size() < 2) {
            throw new RuntimeException("Not enough participants for this match");
        }
        match.setParticipants(participants);
    }
}