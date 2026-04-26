package com.uniranking.app.domains.soloMatch;

import java.util.UUID;

import com.uniranking.app.domains.searching.university.UniversityResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SoloMatchResponse {
    private UUID publicMatchId;
    private UniversityResponse university1;
    private UniversityResponse university2;
}