package com.uniranking.app.domains.support;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SupportResponse {
    private Long id;
    private String username;
    private String content;
    private LocalDateTime createTime;
}
