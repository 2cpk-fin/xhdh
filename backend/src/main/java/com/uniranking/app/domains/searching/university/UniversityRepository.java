package com.uniranking.app.domains.searching.university;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {

    @Query("SELECT DISTINCT u FROM University u LEFT JOIN FETCH u.tags")
    List<University> findAllWithTags();

    @Query(value = "SELECT tag FROM university_tags WHERE university_id = :universityId", nativeQuery = true)
    Set<Tag> findTagsByUniversityId(@Param("universityId") Long universityId);

    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN FETCH u.tags t " +
            "WHERE (:input IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', CAST(:input AS string), '%'))) " +
            "AND (:#{#tags == null || #tags.isEmpty()} = true OR t IN :tags)")
    Page<University> findByInput(
            Pageable pageable,
            @Param("input") String input,
            @Param("tags") List<Tag> tags
    );

    @Query("SELECT u FROM University u WHERE u.id IN :ids")
    List<University> findForEloUpdate(@Param("ids") List<Long> ids);

    @Modifying
    @Transactional
    @Query("UPDATE University u SET u.elo = :elo WHERE u.id = :id")
    int updateElo(@Param("id") Long id, @Param("elo") int elo);
}