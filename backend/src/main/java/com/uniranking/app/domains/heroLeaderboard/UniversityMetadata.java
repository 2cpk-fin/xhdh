package com.uniranking.app.domains.heroLeaderboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UniversityMetadata implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    
    private String name;
    private String abbreviation;
    private int elo;
    private List<String> tagNames;
}