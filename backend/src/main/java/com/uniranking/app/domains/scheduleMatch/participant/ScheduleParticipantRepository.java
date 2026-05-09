package com.uniranking.app.domains.scheduleMatch.participant;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleParticipantRepository extends JpaRepository<ScheduleParticipant, Long> {

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE ScheduleParticipant mp " +
            "SET mp.totalVotes = :totalVotes " +
            "WHERE mp.university.id = :universityId " +
            "AND mp.scheduleMatch.id = :matchId")
    void updateTotalVotes(@Param("universityId") long universityId,
                          @Param("matchId") long matchId,
                          @Param("totalVotes") long totalVotes);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE ScheduleParticipant mp " +
            "SET mp.rank = :rank " +
            "WHERE mp.university.id = :universityId " +
            "AND mp.scheduleMatch.id = :matchId")
    void updateRank(@Param("universityId") long universityId,
                          @Param("matchId") long matchId,
                          @Param("rank") int rank);
}
