package com.uniranking.app.domains.soloMatch;

public interface SoloMatchService {

    /**
     * Processes the result of a duel, updates Elo ratings, and saves changes to the database.
     * Validates that the match exists in Redis and that the winner was part of that match.
     */
    SoloMatchReport chooseWinner(Long winnerId, Long loserId);
}