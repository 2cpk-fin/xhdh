export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // Current page index (0-based)
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}

// Event Match Types
export type MatchStatus = 'NOT_STARTED' | 'PENDING' | 'FINISHED';

export interface ScheduleParticipantResponse {
    id: string; // UUID mapped to string
    universityName: string;
    totalVotes: number;
    rank: number;
}

export interface ScheduleMatchRequest {
    title: string;
    tagName: string;
    participants: string[];
    startTime: string; // ISO DateTime string (e.g., "2026-01-01T10:00:00")
    endTime: string;   // ISO DateTime string
}

export interface ScheduleMatchResponse {
    id: string; // UUID mapped to string
    title: string;
    status: MatchStatus;
    participants: ScheduleParticipantResponse[];
    startTime: string; // ISO DateTime string
    endTime: string;   // ISO DateTime string
}

// Comment Types
export interface CommentRequest {
    userId: number;
    matchId: number;
    parentId?: number; // Optional: Only required if replying
    content: string;
}

export interface CommentResponse {
    id: string; // UUID mapped to string
    username: string;
    matchId: string; // UUID mapped to string
    commentDate: string; // ISO DateTime string
    likes: number;
    parentId: string | null; // Null if it's a top-level comment
    content: string;
}