package com.uniranking.app.domains.user;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    @Query("SELECT u FROM User u " +
            "WHERE (:username IS NULL OR LOWER(u.username) LIKE LOWER(CAST(CONCAT('%', :username, '%') AS text)))")
    Page<User> findByInput(PageRequest pageRequest, @Param("username") String username);

    @Modifying(clearAutomatically = true) // Update -> Clear cache -> Re-fetch if you read again
    @Transactional
    @Query("UPDATE User u SET u.username = :username WHERE u.id = :id")
    int updateUsername(@Param("id") Long id, @Param("username") String username);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.email = :email WHERE u.id = :id")
    int updateEmail(@Param("id") Long id, @Param("email") String email);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.password = :password WHERE u.id = :id")
    int updatePassword(@Param("id") Long id, @Param("password") String password);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.profileImage = :image WHERE u.id = :id")
    int updateProfileImage(@Param("id") Long id, @Param("image") String image);
}
