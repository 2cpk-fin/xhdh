package com.uniranking.app.domains.scheduleMatch.match;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleMatchRepository extends JpaRepository<ScheduleMatch, Long> {

    @Query("SELECT m FROM ScheduleMatch m WHERE m.status != 'FINISHED'")
    List<ScheduleMatch> findAllNotFinishedMatch();
}
