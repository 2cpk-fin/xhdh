package com.uniranking.app.domains.user;

import java.util.Optional;
import java.util.UUID;

import com.uniranking.app.domains.auth.UserSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    Optional<User> findByPublicUserId(UUID publicUserId);

    Optional<UserSummary> findSummaryByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.username = :username WHERE u.id = :id")
    void updateUsername(@Param("id") Long id, @Param("username") String username);

    @Modifying
    @Query("UPDATE User u SET u.email = :email WHERE u.id = :id")
    void updateEmail(@Param("id") Long id, @Param("email") String email);

    @Modifying
    @Query("UPDATE User u SET u.password = :password WHERE u.id = :id")
    void updatePassword(@Param("id") Long id, @Param("password") String password);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.profileImage = :image WHERE u.id = :id")
    void updateProfileImage(@Param("id") Long id, @Param("image") String image);
}
