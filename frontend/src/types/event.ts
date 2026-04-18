// Event Match Types
export interface ParticipantResponse {
    publicUniversityId: string;
    universityName: string;
    totalVotes: number;
    rank: number;
}

export interface ScheduleMatchResponse {
    publicMatchId: string;
    matchId: number;
    title: string;
    status: 'NOT_STARTED' | 'PENDING' | 'FINISHED';
    participants: ParticipantResponse[];
    startTime: string; // ISO DateTime string
    endTime: string; // ISO DateTime string
}

// Comment Types
export interface CommentResponse {
    publicCommentId: string;
    username: string;
    matchId: number; // FIXED: Changed to number to align with backend Long
    commentDate: string; // ISO DateTime string
    likes: number;
    parentId: number | null; // FIXED: Changed to number
    content: string;
}

export interface CommentRequest {
    userId: number;
    matchId: number; // FIXED: Changed to number
    parentId?: number; // FIXED: Changed to number
    content: string;
}

// Pagination Types
export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}