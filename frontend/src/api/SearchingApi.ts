import axios from './axios';
import type { Page } from '../types/ScheduleMatch';
import type { UniversityResponse, TagResponse } from '../types/Searching';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
});

export const universityAPI = {
    // GET /api/universities?page=0&size=15&sort=elo,desc
    getUniversityList: async (
        page: number = 0,
        size: number = 15,
        sort: string = 'elo,desc'
    ): Promise<Page<UniversityResponse>> => {
        // 2. Replaced 'universityAxios' with 'api'
        const { data } = await api.get<Page<UniversityResponse>>('/universities', {
            params: { page, size, sort }
        });
        return data;
    },

    // GET /api/universities/name/{universityName}
    getUniversityByName: async (universityName: string): Promise<UniversityResponse> => {
        const { data } = await api.get<UniversityResponse>(`/universities/name/${universityName}`);
        return data;
    },

    // GET /api/universities/tags/{universityName}
    showAllTagsInUniversity: async (universityName: string): Promise<string[]> => {
        const { data } = await api.get<string[]>(`/universities/tags/${universityName}`);
        return data;
    }
};

export const tagAPI = {
    // GET /api/tags/all
    showAllTags: async (): Promise<TagResponse[]> => {
        // 3. Replaced 'tagAxios' with 'api' and adjusted path relative to '/api'
        const { data } = await api.get<TagResponse[]>('/tags/all');
        return data;
    },

    // GET /api/tags/universities/{tagName}
    showTagByName: async (tagName: string): Promise<string[]> => {
        const { data } = await api.get<string[]>(`/tags/universities/${tagName}`);
        return data;
    }
};