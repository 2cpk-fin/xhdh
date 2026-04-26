package com.uniranking.app.domains.searching.university;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long>{
    @Query(nativeQuery = true, value = """
    SELECT DISTINCT u.* FROM universities u
    LEFT JOIN universities_tags ut ON u.id = ut.university_id
    WHERE (:input IS NULL OR u.name ILIKE CONCAT('%', :input, '%'))
      AND (:tagIds IS NULL OR ut.tag_id IN :tagIds)
    """)
    Page<University> findByInput(
            Pageable pageable,
            @Param("input") String input,
            @Param("tagIds") List<Long> tagIds
    );

    @Query(nativeQuery = true, value = "SELECT * FROM universities ORDER BY RANDOM() LIMIT 1")
    University findRandom();

    @Query(nativeQuery = true, value = """
    WITH TargetTags AS (
        SELECT tag_id
        FROM universities_tags
        WHERE university_id = :universityId
    ),
    OpponentIds AS (
        SELECT ut.university_id
        FROM universities_tags ut
        WHERE ut.tag_id IN (SELECT tag_id FROM TargetTags)
    )
    SELECT u.* FROM universities u
    WHERE u.id != :universityId
    AND u.id IN (SELECT university_id FROM OpponentIds)
    """)
    List<University> findAllOpponentsWithSharedTag(@Param("universityId") long universityId);
}
