package com.xhdh.xhdh.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "universities")
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vote> votes = new ArrayList<>();

    @OneToMany(mappedBy = "leftUniversity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> leftMatches = new ArrayList<>();

    @OneToMany(mappedBy = "rightUniversity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> rightMatches = new ArrayList<>();

    @OneToMany(mappedBy = "winner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> winnerMatches = new ArrayList<>();

    @OneToMany(mappedBy = "loser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> loserMatches = new ArrayList<>();

    @NotBlank(message = "Name is required")
    private String name;

    private String abbreviation;

    private int elo;

    @ManyToMany
    @JoinTable(
            name = "university-tag",
            joinColumns = @JoinColumn(name = "university_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();
}
