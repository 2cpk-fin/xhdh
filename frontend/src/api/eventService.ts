import api from './axios';
import type { ScheduleMatchResponse, CommentResponse, CommentRequest, Page } from '../types/event';

// Event Match API Endpoints
export const eventMatchAPI = {
    // Get all scheduled matches
    getAllMatches: () => api.get<ScheduleMatchResponse[]>('/api/events/match/all'),

    // Get matches not started
    getNotStartedMatches: () => api.get<ScheduleMatchResponse[]>('/api/events/match/all/not-started'),

    // Get pending matches
    getPendingMatches: () => api.get<ScheduleMatchResponse[]>('/api/events/match/all/pending'),

    // Get finished matches
    getFinishedMatches: () => api.get<ScheduleMatchResponse[]>('/api/events/match/all/finished'),

    // Get participants for a specific match
    getMatchParticipants: (matchId: string) => api.get(`/api/events/match/${matchId}/participants`),

    // Create a scheduled match
    createMatch: (matchData: any) => api.post<ScheduleMatchResponse>('/api/events/match', matchData),

    // Update a scheduled match
    updateMatch: (matchId: string, matchData: any) => api.put<ScheduleMatchResponse>(`/api/events/match/${matchId}`, matchData),

    // Vote on a match
    voteOnMatch: (matchId: string, universityName: string) =>
        api.patch(`/api/events/match/votes/${matchId}`, null, { params: { universityName } }),

    // Delete a match
    deleteMatch: (matchId: string) => api.delete(`/api/events/match/${matchId}`),
};

// Comment API Endpoints
export const commentAPI = {
    // Get top-level comments for a match (paginated)
    getComments: (matchId: number, page: number = 0, size: number = 20) =>
        api.get<Page<CommentResponse>>(`/api/matches/${matchId}/comments`, {
            params: { page, size, sort: 'commentDate,desc' },
        }),

    // Get replies to a comment
    getReplies: (parentId: number) => api.get<CommentResponse[]>(`/api/matches/${parentId}/replies`),

    // Create a new comment
    createComment: (commentData: CommentRequest) => api.post<CommentResponse>('/api/matches', commentData),

    // Like a comment
    likeComment: (commentId: string) => api.patch(`/api/matches/comments/${commentId}/likes`, null, { params: { id: commentId } }),

    // Update a comment
    updateComment: (commentId: string, newContent: string) =>
        api.put<CommentResponse>(`/api/matches/comments/${commentId}`, null, { params: { newContent } }),

    // Delete a comment
    deleteComment: (commentId: string) => api.delete(`/api/matches/comments/${commentId}`),
};