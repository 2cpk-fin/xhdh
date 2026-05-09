package com.uniranking.app.domains.searching.university;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipant;
import com.uniranking.app.domains.searching.tag.Tag;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "universities")
@DynamicInsert
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "public_university_id", updatable = false, nullable = false)
    @UuidGenerator
    @Builder.Default
    private UUID publicUniversityId = UUID.randomUUID();

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 10, nullable = false, unique = true)
    private String abbreviation;

    @Column(name = "elo", nullable = false)
    @ColumnDefault("1200")
    @Builder.Default
    private int elo = 1200;

    @ManyToMany
    @JoinTable(name = "universities_tags", joinColumns = @JoinColumn(name = "university_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    @Builder.Default
    private List<Tag> tags = new ArrayList<>();

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ScheduleParticipant> participants = new ArrayList<>();
}
