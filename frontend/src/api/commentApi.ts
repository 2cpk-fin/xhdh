import api from './axios'
import type { Page } from '../types/general'
import type { CommentRequest, CommentResponse, CommentUpdateRequest } from '../types/comment'

export const commentApi = {
    getAllComments: async (
        matchId: number,
        page: number = 0,
        size: number = 20,
        sort: string = 'commentDate,desc',
    ): Promise<Page<CommentResponse>> => {
        const { data } = await api.get<Page<CommentResponse>>(`/schedule/match/comments/${matchId}`, {
            params: {
                page,
                size,
                sort,
            }
        });
        return data;
    },

    createComment: async (request: CommentRequest): Promise<CommentResponse> => {
        const { data } = await api.post<CommentResponse>('/schedule/match/comments', request);
        return data;
    },

    updateComment: async (id: number, request: CommentUpdateRequest): Promise<CommentResponse> => {
        const { data } = await api.patch<CommentResponse>(`/schedule/match/comments/${id}`, request);
        return data;
    },

    deleteComment: async (id: number): Promise<string> => {
        const { data } = await api.delete<string>(`/schedule/match/comments/${id}`);
        return data;
    }
}