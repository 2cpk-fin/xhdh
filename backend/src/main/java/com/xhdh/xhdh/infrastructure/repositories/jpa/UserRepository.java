package com.xhdh.xhdh.infrastructure.repositories.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xhdh.xhdh.domain.models.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User,Long>{
    boolean existsByEmail(String email);

    Optional<User>findByEmail(String email);

    Optional<User> findByUserUUID(UUID userUUID);

    @Query("SELECT u FROM User u WHERE u.id = :userId")
    User getUserById(@Param("userId") Long userId);
}
