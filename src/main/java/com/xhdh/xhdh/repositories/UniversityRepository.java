package com.xhdh.xhdh.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.xhdh.xhdh.models.University;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository extends JpaRepository<University,Integer>{

    University findByName(String universityName);

    University findByAbbreviation(String universityAbbreviation);

    @Query(value = "SELECT * FROM universities ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    University findRandom();

    @Query(value = "SELECT DISTINCT u2.* FROM universities u1 " +
               "JOIN university_tags ut1 ON u1.id = ut1.university_id " +
               "JOIN university_tags ut2 ON ut1.tag_id = ut2.tag_id " +
               "JOIN universities u2 ON ut2.university_id = u2.id " +
               "WHERE u1.id = :universityId " +
               "AND u2.id <> :universityId", nativeQuery = true)
    List<University> findAllOpponentsWithSharedTag(@Param("universityId") int universityId);
}