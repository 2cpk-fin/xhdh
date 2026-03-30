package com.xhdh.xhdh.infrastructure.repositories.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import com.xhdh.xhdh.domain.models.RefreshToken;
import com.xhdh.xhdh.domain.models.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long>{
    Optional<RefreshToken> findByToken(String token);
    @Modifying
    void deleteByUser(User user);
}
