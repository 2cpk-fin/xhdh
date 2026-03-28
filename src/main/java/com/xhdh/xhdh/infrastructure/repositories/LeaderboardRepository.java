package com.xhdh.xhdh.infrastructure.repositories;

import com.xhdh.xhdh.domain.models.Participant;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaderboardRepository extends CrudRepository<Participant, String> {

}
