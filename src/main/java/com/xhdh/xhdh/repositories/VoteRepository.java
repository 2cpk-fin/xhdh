package com.xhdh.xhdh.repositories;

import com.xhdh.xhdh.models.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote,Long> {

    @Query("SELECT v FROM Vote v WHERE v.user.username = :username")
    List<Vote> findAllByUsername(@Param("username") String username);

    @Query("SELECT v FROM Vote v WHERE v.university.name = :universityName OR v.university.abbreviation = :universityName")
    List<Vote> findAllByUniversityName(@Param("universityName") String universityName);
}
