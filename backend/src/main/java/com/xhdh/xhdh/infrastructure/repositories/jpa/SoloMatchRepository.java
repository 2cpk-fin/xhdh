package com.xhdh.xhdh.infrastructure.repositories.jpa;

import com.xhdh.xhdh.domain.models.SoloMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SoloMatchRepository extends JpaRepository<SoloMatch, Long> {
    Optional<SoloMatch> findByMatchUUID(UUID matchUUID);

    List<SoloMatch> findByOwnerUUID(UUID ownerUUID);

}
