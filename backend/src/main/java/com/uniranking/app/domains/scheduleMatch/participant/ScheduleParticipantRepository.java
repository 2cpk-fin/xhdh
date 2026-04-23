package com.uniranking.app.domains.scheduleMatch.participant;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleParticipantRepository extends JpaRepository<ScheduleParticipant, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE ScheduleParticipant mp " +
            "SET mp.totalVotes = mp.totalVotes + 1 " +
            "WHERE mp.university.id = :universityId " +
            "AND mp.scheduleMatch.id = :matchId")
    void addVoteToUniversity(@Param("universityId") long universityId, @Param("matchId") long matchId);
}
