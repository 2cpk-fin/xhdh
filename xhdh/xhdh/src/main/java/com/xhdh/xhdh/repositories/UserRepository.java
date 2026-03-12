package com.xhdh.xhdh.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xhdh.xhdh.models.User;

public interface UserRepository extends JpaRepository<User,Integer>{
    boolean existsByEmail(String email);
}
