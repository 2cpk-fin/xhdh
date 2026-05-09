import type { UserResponse } from "./user";

export type CommentRequest = {
    matchId: number;
    parentId?: number;
    content: string;
};

export type CommentResponse = {
    id: number;
    publicCommentId: string;
    user: UserResponse;
    commentDate: string;
    parent: CommentResponse;
    content: string;
}

export type CommentUpdateRequest = {
    content: string;
}