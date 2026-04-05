package com.xhdh.xhdh.infrastructure.repositories.jpa;

import com.xhdh.xhdh.domain.models.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {

    @Query("SELECT c FROM Comment c WHERE c.match.id = :matchId AND c.parent IS NULL")
    Page<Comment> findAllTopComments(@Param("matchId") Long matchId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.parent.id = :parentId")
    List<Comment> findByAllSubcommentsByParentId(@Param("parentId") Long parentId);

    @Query("SELECT c FROM Comment c WHERE c.id = :parentId")
    Comment findByParentId(@Param("parentId") Long parentId);
}
