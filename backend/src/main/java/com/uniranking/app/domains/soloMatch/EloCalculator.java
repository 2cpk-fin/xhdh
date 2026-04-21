package com.uniranking.app.domains.soloMatch;

import org.springframework.stereotype.Component;

@Component
public class EloCalculator{
    public static final int Multiplier = 32;
    public int calculateSoloChange(
                int currentElo,
                int opponentElo,
                boolean isWinner)
    {
        double expectedScore = 1.0 / (1.0 + Math.pow(10, (double) (opponentElo - currentElo)/400));
        double actualScore = isWinner ? 1.0 : 0.0;

        return (int)(Math.round(currentElo + Multiplier * (actualScore - expectedScore)));
    } 
}