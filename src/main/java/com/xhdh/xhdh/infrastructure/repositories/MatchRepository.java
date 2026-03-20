package com.xhdh.xhdh.infrastructure.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xhdh.xhdh.domain.models.Match;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE m.status != 'FINSIHED'")
    List<Match> findAllNotFinishedMatch();
}
