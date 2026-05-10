package com.uniranking.app.domains.searching.university;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {

    @Query("SELECT t FROM University u JOIN u.tags t WHERE u.id = :universityId")
    Set<Tag> findTagsByUniversityId(@Param("universityId") Long universityId);

    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN u.tags t " +
            "WHERE (:input IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', CAST(:input AS string), '%'))) " +
            "AND (:#{#tags == null || #tags.isEmpty()} = true OR t IN :tags)")
    Page<University> findByInput(
            Pageable pageable,
            @Param("input") String input,
            @Param("tags") List<Tag> tags
    );

}