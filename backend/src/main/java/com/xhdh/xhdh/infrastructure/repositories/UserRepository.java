package com.xhdh.xhdh.infrastructure.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xhdh.xhdh.domain.models.User;

public interface UserRepository extends JpaRepository<User,Long>{
    boolean existsByEmail(String email);

    Optional<User>findByEmail(String email);

    Optional<User> findByUserUUID(UUID userUUID);
}
