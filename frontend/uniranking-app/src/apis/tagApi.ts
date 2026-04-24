import api from './axios'
import type { TagResponse } from '../types/tag'

export const tagApi = {
    getAllTags: async (): Promise<TagResponse[]> => {
        const { data } = await api.get<TagResponse[]>('/tags/all');
        return data;
    },

    getTagsByUniversity: async (universityId: number): Promise<TagResponse[]> => {
        const { data } = await api.get<TagResponse[]>(`/tags/${universityId}`);
        return data;
    },
}