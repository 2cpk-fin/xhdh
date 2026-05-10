import type { UniversityResponse } from "./university"

export type ScheduleParticipantResponse = {
    universityResponse: UniversityResponse;
    totalVotes: number;
    rank: number;
}

export type ScheduleMatchRequest = {
    title: string;
    uniIds: number[];
    startTime: string;
    endTime: string;
}

export type ScheduleMatchResponse = {
    id: number;
    publicMatchId: string;
    title: string;
    status: string;
    participants: ScheduleParticipantResponse[];
    startTime: string;
    endTime: string;
}