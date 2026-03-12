package com.xhdh.xhdh.repositories;

import com.xhdh.xhdh.models.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote,Long> {
}
