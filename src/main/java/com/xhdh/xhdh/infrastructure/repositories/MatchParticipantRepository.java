package com.xhdh.xhdh.infrastructure.repositories;

import com.xhdh.xhdh.domain.models.MatchParticipant;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchParticipantRepository extends JpaRepository<MatchParticipant, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE MatchParticipant mp " +
            "SET mp.totalVotes = mp.totalVotes + 1 " +
            "WHERE mp.university.id = :universityId " +
            "AND mp.match.id = :matchId")
    void addVoteToUniversity(@Param("universityId") long universityId, @Param("matchId") long matchId);
}
