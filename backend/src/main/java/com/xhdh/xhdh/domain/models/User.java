package com.xhdh.xhdh.domain.models;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "users")
@Builder/*lets you use the builder constructor */
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String username;

    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;

    @Column(nullable = true)
    private String password;

    private Instant createdAt;

    private Long totalVote;

    private UUID userUUID;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuthProvider authProvider = AuthProvider.LOCAL;


    @Override
    public String getUsername(){
        return this.email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vote> votes = new ArrayList<>();


    // One user -> Many comments
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
}
