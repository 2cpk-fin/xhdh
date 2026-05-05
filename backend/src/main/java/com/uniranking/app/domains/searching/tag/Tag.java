package com.uniranking.app.domains.searching.tag;

import com.uniranking.app.domains.searching.university.University;
import jakarta.persistence.*;
import lombok.*;
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
@Table(name = "tags")
@DynamicInsert
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "public_tag_id", updatable = false, nullable = false)
    @UuidGenerator
    @Builder.Default
    private UUID publicTagId = UUID.randomUUID();

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "tags")
    @Builder.Default
    List<University> universities = new ArrayList<>();
}
