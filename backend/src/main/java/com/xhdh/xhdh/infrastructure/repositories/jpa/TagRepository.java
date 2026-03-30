package com.xhdh.xhdh.infrastructure.repositories.jpa;

import com.xhdh.xhdh.domain.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    @Query("SELECT t FROM Tag t JOIN FETCH t.universities u WHERE u.name = :universityName OR u.abbreviation = :universityName")
    List<Tag> findAllByUniversityName(@Param("universityName") String universityName);
}
