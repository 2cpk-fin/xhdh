package com.uniranking.app.domains.scheduleMatch.comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE :matchId IS NOT NULL AND c.scheduleMatch.id = :matchId")
    Page<Comment> findByMatch(@Param("matchId") Long matchId, Pageable pageable);

}