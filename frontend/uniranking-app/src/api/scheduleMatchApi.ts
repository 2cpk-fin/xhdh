import api from './axios'
import type { ScheduleMatchRequest, ScheduleMatchResponse, ScheduleParticipantResponse } from '../types/scheduleMatch'

export const scheduleMatchApi = {
    getScheduledMatchesNotStarted: async (): Promise<ScheduleMatchResponse[]> => {
        const { data } = await api.get<ScheduleMatchResponse[]>('/schedule/match/all/not-started');
        return data;
    },

    getScheduledPendingMatches: async (): Promise<ScheduleMatchResponse[]> => {
        const { data } = await api.get<ScheduleMatchResponse[]>('/schedule/match/all/pending');
        return data;
    },

    getScheduledFinishedMatches: async (): Promise<ScheduleMatchResponse[]> => {
        const { data } = await api.get<ScheduleMatchResponse[]>('/schedule/match/all/finished');
        return data;
    },

    // For upcoming & finished matches — shows DB-persisted participant data (votes, rank)
    getMatchParticipants: async (matchId: number): Promise<ScheduleParticipantResponse[]> => {
        const { data } = await api.get<ScheduleParticipantResponse[]>(`/schedule/match/${matchId}/participants`);
        return data;
    },

    // For pending (live) matches — reads from Redis leaderboard, real-time vote counts
    getLeaderboard: async (publicMatchId: string): Promise<ScheduleParticipantResponse[]> => {
        const { data } = await api.get<ScheduleParticipantResponse[]>(`/schedule/match/leaderboard/${publicMatchId}`);
        return data;
    },

    vote: async (publicMatchId: string, universityId: number): Promise<void> => {
        await api.patch(`/schedule/match/votes?publicMatchId=${publicMatchId}&universityId=${universityId}`);
    },

    createMatch: async (request: ScheduleMatchRequest): Promise<ScheduleMatchResponse> => {
        const { data } = await api.post<ScheduleMatchResponse>('/schedule/match', request);
        return data;
    },

    updateMatch: async (id: number, request: ScheduleMatchRequest): Promise<ScheduleMatchResponse> => {
        const { data } = await api.patch<ScheduleMatchResponse>(`/schedule/match/${id}`, request);
        return data;
    },

    deleteMatch: async (id: number): Promise<string> => {
        const { data } = await api.delete<string>(`/schedule/match/${id}`);
        return data;
    },
}