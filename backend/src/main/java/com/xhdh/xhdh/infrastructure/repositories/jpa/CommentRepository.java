package com.xhdh.xhdh.infrastructure.repositories.jpa;

import com.xhdh.xhdh.domain.models.comment.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {

    @Query("SELECT c FROM Comment c WHERE c.match.id = :matchId AND c.parent IS NULL")
    Page<Comment> findAllTopComments(@Param("matchId") Long matchId, Pageable pageable);

    @Query(value = "SELECT c FROM Comment c " +
            "JOIN FETCH c.user " +
            "JOIN FETCH c.match " +
            "WHERE c.match.id = :matchId AND c.parent IS NULL",
            countQuery = "SELECT count(c) FROM Comment c WHERE c.match.id = :matchId AND c.parent IS NULL")
    List<Comment> findByAllSubcommentsByParentId(@Param("parentId") Long parentId);

    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.likes = c.likes + 1 WHERE c.id = :id")
    void incrementLikes(@Param("id") Long id);
}
