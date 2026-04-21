import axios from './axios';
import type { ScheduleMatchRequest, ScheduleMatchResponse, CommentResponse, CommentRequest, Page, ScheduleParticipantResponse } from '../types/ScheduleMatch.ts';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/events/match'
});

// Event Match API Endpoints
export const eventMatchAPI = {
    getAllMatch: async (): Promise<ScheduleMatchResponse[]> => {
        const { data } = await api.get<ScheduleMatchResponse[]>('/all');
        return data;
    },

    getNotStartedMatches: async (): Promise<ScheduleMatchResponse[]> => {
        const { data } = await api.get<ScheduleMatchResponse[]>('/all/not-started');
        return data;
    },

    getPendingMatches: async (): Promise<ScheduleMatchResponse[]> => {
        const { data } = await api.get<ScheduleMatchResponse[]>('/all/pending');
        return data;
    },

    getFinishedMatches: async (): Promise<ScheduleMatchResponse[]> => {
        const { data } = await api.get<ScheduleMatchResponse[]>('/all/finished');
        return data;
    },

    getMatchParticipants: async (id: number): Promise<ScheduleParticipantResponse[]> => {
        const { data } = await api.get<ScheduleParticipantResponse[]>(`/${id}/participants`);
        return data;
    },

    createMatch: async (matchData: ScheduleMatchRequest): Promise<ScheduleMatchResponse> => {
        const { data } = await api.post<ScheduleMatchResponse>('', matchData);
        return data;
    },

    updateMatch: async (id: number, matchData: ScheduleMatchRequest): Promise<ScheduleMatchResponse> => {
        const { data } = await api.put<ScheduleMatchResponse>(`/${id}`, matchData);
        return data;
    },

    voteOnMatch: async (matchId: string, universityName: string): Promise<void> => {
        await api.patch(`/votes/${matchId}`, null, { params: { universityName } });
    },

    deleteMatch: async (id: number): Promise<string> => {
        const { data } = await api.delete<string>(`/${id}`);
        return data;
    }
};

// Comment API Endpoints
export const commentAPI = {
    // GET /api/events/match/comments/{matchId}
    getComments: async (matchId: number, page: number = 0, size: number = 20): Promise<Page<CommentResponse>> => {
        const { data } = await api.get<Page<CommentResponse>>(`/comments/${matchId}`, {
            params: { page, size }
        });
        return data;
    },

    // GET /api/events/match/comments/{parentId}/replies
    getReplies: async (parentId: number): Promise<CommentResponse[]> => {
        const { data } = await api.get<CommentResponse[]>(`/comments/${parentId}/replies`);
        return data;
    },

    // POST /api/events/match/comments
    createComment: async (commentData: CommentRequest): Promise<CommentResponse> => {
        // Hits the @PostMapping at the root of the CommentController (/comments)
        const { data } = await api.post<CommentResponse>('/comments', commentData);
        return data;
    },

    // PATCH /api/events/match/comments/{id}/likes
    likeComment: async (commentId: number): Promise<void> => {
        // Removed the redundant params object since the backend uses @PathVariable
        await api.patch(`/comments/${commentId}/likes`);
    },

    // PATCH /api/events/match/comments/{id}
    updateComment: async (id: number, newContent: string): Promise<CommentResponse> => {
        // Changed to patch, sending newContent in the body with text/plain headers
        const { data } = await api.patch<CommentResponse>(`/comments/${id}`, newContent, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        return data;
    },

    // DELETE /api/events/match/comments/{id}
    deleteComment: async (id: number): Promise<string> => {
        const { data } = await api.delete<string>(`/comments/${id}`);
        return data;
    }
};

// Leaderboard API Endpoints
export const leaderboardAPI = {
    getLeaderboard: async (matchId: string): Promise<ScheduleParticipantResponse[]> => {
        const { data } = await api.get<ScheduleParticipantResponse[]>(`/leaderboard/${matchId}`);
        return data;
    }
};