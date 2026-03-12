package com.xhdh.xhdh.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "matches")
@NotBlank
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "left_id", nullable = false)
    private University leftUniversity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "right_id", nullable = false)
    private University rightUniversity;

    private long leftVotes;

    private long rightVotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id",  nullable = false)
    private Tag tag;

    private LocalDateTime startTime;

    private LocalDateTime endTime;


}
