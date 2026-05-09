package com.uniranking.app.domains.scheduleMatch.participant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatch;
import com.uniranking.app.domains.searching.university.University;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "participants")
@DynamicInsert
public class ScheduleParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ColumnDefault("0")
    private long totalVotes = 0;

    @ColumnDefault("1")
    private int rank = 1;

    @ManyToOne()
    @JoinColumn(name = "match_id", nullable = false)
    @JsonIgnoreProperties("participants")
    private ScheduleMatch scheduleMatch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    @JsonIgnoreProperties("participants")
    private University university;
}
