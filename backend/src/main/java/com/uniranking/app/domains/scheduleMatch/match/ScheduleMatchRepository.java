package com.uniranking.app.domains.scheduleMatch.match;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScheduleMatchRepository extends JpaRepository<ScheduleMatch, Long> {

    @Query("SELECT m FROM ScheduleMatch m WHERE m.status = 'NOT_STARTED'")
    List<ScheduleMatch> findAllNotStartedMatch();

    @Query("SELECT m FROM ScheduleMatch m WHERE m.status = 'PENDING'")
    List<ScheduleMatch> findAllPendingMatch();

    @Query("SELECT m FROM ScheduleMatch m WHERE m.status = 'FINISHED'")
    List<ScheduleMatch> findAllFinishedMatch();

    @Query("SELECT m FROM ScheduleMatch m WHERE m.publicMatchId = :publicMatchId")
    ScheduleMatch findByPublicMatchId(@Param("publicMatchId") UUID publicMatchId);

    @Modifying
    @Transactional
    @Query("UPDATE ScheduleMatch m SET m.status = :newStatus WHERE m.publicMatchId = :publicMatchId AND m.status = :expectedStatus")
    int compareAndUpdateStatus(@Param("publicMatchId") UUID publicMatchId,
                               @Param("expectedStatus") Status expectedStatus,
                               @Param("newStatus") Status newStatus);
}
