package com.uniranking.app.domains.soloMatch;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SoloMatch implements Serializable {
    private UUID publicMatchId;

    private long uni1Id;
    private long uni2Id;

    private UUID publicUni1Id;
    private UUID publicUni2Id;
}
