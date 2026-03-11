package com.xhdh.xhdh.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "university_tag")
public class UniversityTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int university_id;
    private byte tag_id;
}
