package com.xhdh.xhdh.domain.models.search;

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
@Table(name = "tags")
@DynamicInsert
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "public_tag_id", updatable = false, nullable = false)
    @ColumnDefault("gen_random_uuid()")
    private UUID publicTagId;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "tags")
    List<University> universities = new ArrayList<>();
}
