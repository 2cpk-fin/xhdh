package com.xhdh.xhdh.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xhdh.xhdh.models.Match;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
}
