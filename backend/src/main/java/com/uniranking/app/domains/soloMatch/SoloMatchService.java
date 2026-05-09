package com.uniranking.app.domains.soloMatch;

import java.util.UUID;

public interface SoloMatchService {

    /**
     * Starts a new 1vs1 duel between two universities.
     * Picks a random university and finds a weighted opponent based on Elo and shared tags.
     */
    SoloMatchResponse startNewDuel();

    /**
     * Processes the result of a duel, updates Elo ratings, and saves changes to the database.
     * Validates that the match exists in Redis and that the winner was part of that match.
     */
    SoloMatchReport chooseWinner(UUID publicMatchId, Long winnerId);
}