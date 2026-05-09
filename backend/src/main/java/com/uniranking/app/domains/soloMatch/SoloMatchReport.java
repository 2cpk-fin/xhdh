package com.uniranking.app.domains.soloMatch;

import com.uniranking.app.domains.searching.university.UniversityResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SoloMatchReport {
    UniversityResponse winner;
    int winnerEloChange;
    UniversityResponse loser;
    int loserEloChange;
}
