package com.uniranking.app.domains.news;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsResponse implements Serializable {
    private static final long serialVersionUID = 1L;
    private List<Article> articles;
    private int currentPage;
    private int totalPages;
    private int pageSize;
    private int totalResults;
    private String status;
}
