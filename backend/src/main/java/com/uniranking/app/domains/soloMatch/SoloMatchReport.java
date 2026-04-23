package com.uniranking.app.domains.soloMatch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SoloMatchReport {
    Long winnerId;
    UUID publicWinnerId;
    Long loserId;
    UUID publicLoserId;
}
