package com.xhdh.xhdh.domain.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@Entity
@Table(name = "comments")
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_comment_id", updatable = false, nullable = false)
    @ColumnDefault("gen_random_uuid()")
    private UUID publicCommentId;

    // Many comments -> One user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many comments -> One match
    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime commentDate;

    @Builder.Default
    @ColumnDefault("1200")
    private Long likes = 0L;

    // One comment only have one parent and one comment can have many sub-comments
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Comment parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Comment> children = new ArrayList<>();

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    @ColumnDefault("1200")
    private Long replyCount = 0L;
}
