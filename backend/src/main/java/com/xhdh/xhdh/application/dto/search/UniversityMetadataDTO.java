package com.xhdh.xhdh.application.dto.search;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UniversityMetadataDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String name;
    private String abbreviation;
    private int elo;
    private List<String> tagNames;
}