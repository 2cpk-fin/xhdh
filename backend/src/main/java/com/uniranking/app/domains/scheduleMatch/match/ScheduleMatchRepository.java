package com.uniranking.app.domains.scheduleMatch.match;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleMatchRepository extends JpaRepository<ScheduleMatch, Long> {

    @Query("SELECT m FROM ScheduleMatch m WHERE m.status = 'NOT_STARTED'")
    List<ScheduleMatch> findAllNotStartedMatch();

    @Query("SELECT m FROM ScheduleMatch m WHERE m.status = 'PENDING'")
    List<ScheduleMatch> findAllPendingMatch();

    @Query("SELECT m FROM ScheduleMatch m WHERE m.status = 'FINISHED'")
    List<ScheduleMatch> findAllFinishedMatch();

    @Query("SELECT m FROM ScheduleMatch m WHERE m.publicMatchId = :publicMatchId")
    ScheduleMatch findByPublicMatchId(@Param("publicMatchId") String publicMatchId);

    @Modifying
    @Query("UPDATE ScheduleMatch m SET m.status = :newStatus WHERE m.publicMatchId = :id AND m.status = :expectedStatus")
    int compareAndUpdateStatus(@Param("id") String id,
                               @Param("expectedStatus") Status expectedStatus,
                               @Param("newStatus") Status newStatus);
}
