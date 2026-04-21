package com.uniranking.app.domains.scheduleMatch.match;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.uniranking.app.domains.scheduleMatch.comment.Comment;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipant;
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
@NoArgsConstructor
@Entity
@Table(name = "matches")
@DynamicInsert
public class ScheduleMatch {
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
    @OneToMany(mappedBy = "scheduleMatch", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("rank ASC")
    private List<ScheduleParticipant> participants = new ArrayList<>();

    // One match can have many comments
    @OneToMany(mappedBy = "scheduleMatch", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    // pattern: Year-Month-Day Hour:00
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:00:00")
    private LocalDateTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:00:00")
    private LocalDateTime endTime;
}
