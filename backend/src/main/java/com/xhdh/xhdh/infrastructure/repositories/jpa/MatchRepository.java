package com.xhdh.xhdh.infrastructure.repositories.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xhdh.xhdh.domain.models.Match;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE m.status != 'FINISHED'")
    List<Match> findAllNotFinishedMatch();

    Optional<Match> findByPublicMatchId(UUID publicMatchId);

    @Query("SELECT m FROM Match m WHERE m.id = :matchId")
    Match getMatchById(@Param("matchId") Long matchId);
}
