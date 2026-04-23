package com.uniranking.app.domains.soloMatch;

import java.util.UUID;

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

    private long uni1Id;
    private long uni2Id;

    private UUID publicUni1Id;
    private UUID publicUni2Id;
}