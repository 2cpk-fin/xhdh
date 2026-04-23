package com.uniranking.app.domains.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    Optional<User> findByPublicUserId(UUID publicUserId);

    Optional<User> findByUsername(String username);
}
