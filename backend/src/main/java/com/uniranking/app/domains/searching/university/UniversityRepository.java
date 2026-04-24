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
    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN u.tags t " +
            "WHERE (:input IS NULL OR LOWER(u.name) LIKE LOWER(CAST(CONCAT('%', :input, '%') AS text))) " +
            "AND (:tagIds IS NULL OR t.id IN :tagIds)")
    Page<University> findByInput(
            Pageable pageable,
            @Param("input") String input,
            @Param("tagIds") List<Long> tagIds
    );

    @Query(value = "SELECT * FROM universities u WHERE EXISTS (" +
                   "  SELECT 1 FROM university_tags ut1 " +
                   "  JOIN university_tags ut2 ON ut1.tag_id = ut2.tag_id " +
                   "  WHERE ut1.university_id = u.id AND ut2.university_id <> u.id" +
                   ") ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    University findRandom();

    @Query(value = "SELECT DISTINCT u2.* FROM universities u1 " +
                   "JOIN university_tags ut1 ON u1.id = ut1.university_id " +
                   "JOIN university_tags ut2 ON ut1.tag_id = ut2.tag_id " +
                   "JOIN universities u2 ON ut2.university_id = u2.id " +
                   "WHERE u1.id = :universityId AND u2.id <> :universityId", nativeQuery = true)
    List<University> findAllOpponentsWithSharedTag(@Param("universityId") long universityId);


    University findByName(String universityName);
}
