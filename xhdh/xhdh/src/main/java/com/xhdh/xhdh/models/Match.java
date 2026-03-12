package com.xhdh.xhdh.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "matches")
@NotBlank
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vote> votes = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "left_university_id", nullable = false)
    private University leftUniversity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "right_university_id", nullable = false)
    private University rightUniversity;

    private long totalLeftVotes;

    private long totalRightVotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id", nullable = false)
    private University winner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loser_id", nullable = false)
    private University loser;

    private long totalVotes;

    private long totalWinningVotes;

    private long totalLosingVotes;

    private LocalDateTime startTime;

    private LocalDateTime endTime;
}
