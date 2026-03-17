package com.xhdh.xhdh.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xhdh.xhdh.models.University;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long>{

    University findByName(String universityName);

    University findByAbbreviation(String universityAbbreviation);

    @Query("SELECT u FROM University u JOIN FETCH u.tags t WHERE t.name = :tagName")
    List<University> findAllByTagName(@Param("tagName") String tagName);
}
