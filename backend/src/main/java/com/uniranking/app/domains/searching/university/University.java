package com.uniranking.app.domains.searching.university;

import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipant;
import com.uniranking.app.domains.searching.tag.Tag;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "universities")
@DynamicInsert
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "public_university_id", updatable = false, nullable = false)
    @ColumnDefault("gen_random_uuid()")
    private UUID publicUniversityId;

    @Column(length = 100, nullable = false, unique = true)
    private String name;

    @Column(length = 10, nullable = false, unique = true)
    private String abbreviation;

    @ColumnDefault("1200")
    private int elo = 1200;

    @ManyToMany
    @JoinTable(
            name = "university_tags",
            joinColumns = @JoinColumn(name = "university_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScheduleParticipant> participants = new ArrayList<>();
}
