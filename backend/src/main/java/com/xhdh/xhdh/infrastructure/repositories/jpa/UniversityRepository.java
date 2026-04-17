package com.xhdh.xhdh.infrastructure.repositories.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.xhdh.xhdh.domain.models.University;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long>{

    @Query("SELECT u FROM University u WHERE u.name = :universityName OR u.abbreviation = :universityName ")
    University findByName(@Param("universityName") String universityName);

    @Query("SELECT u FROM University u JOIN FETCH u.tags t WHERE t.name = :tagName")
    List<University> findAllByTagName(@Param("tagName") String tagName);

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

    @Query("SELECT u FROM University u")
    Page<University> findUniversityList(Pageable pageable);

}
