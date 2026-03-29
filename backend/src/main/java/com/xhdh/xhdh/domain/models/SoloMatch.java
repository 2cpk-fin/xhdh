package com.xhdh.xhdh.domain.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "solo_matches")
public class SoloMatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, updatable = false)
    private UUID ownerUUID;

    @Column(nullable = false, updatable = false)
    private UUID matchUUID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_a_id", nullable = false)
    private University universityA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_b_id", nullable = false)
    private University universityB;

    @Column(nullable = false, updatable = false)
    private Instant startDate;

    private Instant endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private University winner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loser_id")
    private University loser;

    private Integer eloChange;
}
