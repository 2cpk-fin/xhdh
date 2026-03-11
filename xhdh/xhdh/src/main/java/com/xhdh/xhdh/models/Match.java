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

    private long userId;
    private int leftId;
    private int rightId;
    private long leftVotes;
    private long rightVotes;
    private int tagId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
