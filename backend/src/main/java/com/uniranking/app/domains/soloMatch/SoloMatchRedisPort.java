package com.uniranking.app.domains.soloMatch;

import java.util.UUID;

public interface SoloMatchRedisPort {
    void saveMatch(SoloMatch match, long ttlInMinutes);
    SoloMatch getMatch(UUID matchId);
    void deleteMatch(UUID matchId);
}
