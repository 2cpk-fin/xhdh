package com.xhdh.xhdh.domain.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Builder.Default
    private UUID publicMatchId = UUID.randomUUID();

    private String title;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Instant startTime;

    private Instant endTime;

    @Builder.Default
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vote> votes = new ArrayList<>();

    @Setter
    @Builder.Default
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("rank ASC")
    private List<MatchParticipant> participants = new ArrayList<>();


    // One match -> Many comments
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
}
