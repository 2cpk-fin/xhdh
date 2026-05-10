import type { UniversityResponse } from "./university";

export type SoloMatchResponse = {
    publicMatchId: string;
    university1: UniversityResponse;
    university2: UniversityResponse;
}

export type SoloMatchReport = {
    winner: UniversityResponse;
    winnerEloChange: number;
    loser: UniversityResponse;
    loserEloChange: number;
}