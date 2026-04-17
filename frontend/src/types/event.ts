// Event Match Types
export interface ParticipantResponse {
    publicUniversityId: string;
    universityName: string;
    totalVotes: number;
    rank: number;
}

export interface ScheduleMatchResponse {
    publicMatchId: string;
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
    matchId: number;
    commentDate: string; // ISO DateTime string
    likes: number;
    parentId: number | null;
    content: string;
}

export interface CommentRequest {
    userId: number;
    matchId: number;
    parentId?: number;
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
