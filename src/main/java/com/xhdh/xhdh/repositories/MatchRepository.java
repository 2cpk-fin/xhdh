package com.xhdh.xhdh.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xhdh.xhdh.models.Match;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE m.status != 'FINSIHED'")
    List<Match> findAllNotFinishedMatch();

    @Query("SELECT m FROM Match m WHERE m.status = 'FINISHED'")
    List<Match> findAllFinishedMatch();
}
