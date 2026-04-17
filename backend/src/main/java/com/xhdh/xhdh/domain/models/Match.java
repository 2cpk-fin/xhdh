package com.xhdh.xhdh.domain.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;
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
@DynamicInsert
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "public_match_id", updatable = false, nullable = false)
    @ColumnDefault("gen_random_uuid()")
    private UUID publicMatchId;

    private String title;

    // NOT_STARTED, PENDING, FINISHED
    @Enumerated(EnumType.STRING)
    private Status status;

    // One match can have many participants
    @Builder.Default
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("rank ASC")
    private List<MatchParticipant> participants = new ArrayList<>();


    // One match can have many comments
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    // pattern: Year-Month-Day Hour:00
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:00:00")
    private LocalDateTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:00:00")
    private LocalDateTime endTime;
}
