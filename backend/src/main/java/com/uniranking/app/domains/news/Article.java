package com.uniranking.app.domains.news;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Article implements Serializable {
    private static final long serialVersionUID = 1L;
    private String title;
    private String description;
    private String url;
    private String imageUrl; // VNUR, MOET, BTT
    private String source;
    private String publishedAt;
}