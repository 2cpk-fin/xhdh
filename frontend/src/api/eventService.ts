import api from './axios';
import type { ScheduleMatchResponse, CommentResponse, CommentRequest, Page } from '../types/event';

// Event Match API Endpoints
export const eventMatchAPI = {
    // Get all scheduled matches
    getAllMatches: () => api.get<ScheduleMatchResponse[]>('/events/match/all'),

    // Get matches not started
    getNotStartedMatches: () => api.get<ScheduleMatchResponse[]>('/events/match/all/not-started'),

    // Get pending matches
    getPendingMatches: () => api.get<ScheduleMatchResponse[]>('/events/match/all/pending'),

    // Get finished matches
    getFinishedMatches: () => api.get<ScheduleMatchResponse[]>('/events/match/all/finished'),

    // Get participants for a specific match
    getMatchParticipants: (matchId: number) => api.get(`/events/match/${matchId}/participants`),

    // Create a scheduled match
    createMatch: (matchData: any) => api.post<ScheduleMatchResponse>('/events/match', matchData),

    // Update a scheduled match
    updateMatch: (matchId: number, matchData: any) => api.put<ScheduleMatchResponse>(`/events/match/${matchId}`, matchData),

    // Vote on a match
    voteOnMatch: (matchId: string, universityName: string) =>
        api.patch(`/events/match/votes/${matchId}`, null, { params: { universityName } }),

    // Delete a match
    deleteMatch: (matchId: number) => api.delete(`/events/match/${matchId}`),
};

// Comment API Endpoints
export const commentAPI = {
    // Get top-level comments for a match (paginated)
    getComments: (matchId: number, page: number = 0, size: number = 20) =>
        api.get<Page<CommentResponse>>(`/matches/${matchId}/comments`, {
            params: { page, size, sort: 'commentDate,desc' },
        }),

    // Get replies to a comment
    getReplies: (parentId: number) => api.get<CommentResponse[]>(`/matches/${parentId}/replies`),

    // Create a new comment
    createComment: (commentData: CommentRequest) => api.post<CommentResponse>('/matches', commentData),

    // Like a comment
    likeComment: (commentId: number) => api.patch(`/matches/comments/${commentId}/likes`, null, { params: { id: commentId } }),

    // Update a comment
    updateComment: (commentId: number, newContent: string) =>
        api.put<CommentResponse>(`/matches/comments/${commentId}`, null, { params: { newContent } }),

    // Delete a comment
    deleteComment: (commentId: number) => api.delete(`/matches/comments/${commentId}`),
};
