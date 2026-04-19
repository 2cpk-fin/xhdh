package com.xhdh.xhdh.infrastructure.repositories.redis;

import com.xhdh.xhdh.domain.models.match.Participant;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaderboardRepository extends CrudRepository<Participant, String> {

}
