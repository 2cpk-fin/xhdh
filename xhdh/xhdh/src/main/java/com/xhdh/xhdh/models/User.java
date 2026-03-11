package com.xhdh.xhdh.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String username;
    private String password;
    private String email;
    private LocalDateTime createdAt;

    public User(){}

    public User(String username, String password, String email, LocalDateTime createdAt){
        this.username = username;
        this.password = password;
        this.email = email;
        this.createdAt = createdAt;
    }

    public Long getId(){
        return id;
    }
    
    public String getUsername(){
        return username;
    }

    public String getPassword(){
        return password;
    }

    public String getEmail(){
        return email;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
}
