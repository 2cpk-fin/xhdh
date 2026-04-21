export interface UniversityDTO {
    id: string;
    name: string;
    abbreviation: string;
    elo: number;
}

export interface MatchResponseDTO {
    matchId: string;
    title: string;
    status: 'NOT_STARTED' | 'PENDING' | 'FINISHED';
    startTime: string;
    endTime: string;
    u1: UniversityDTO;
    u2: UniversityDTO;
    ownerUUID: string;
}

export interface SoloMatchReport {
    winnerId: string;
    loserId: string;
    eloChange: number;
}

export interface SoloChoiceRequest {
    matchUUID: string;
    universityUUID: string;
}