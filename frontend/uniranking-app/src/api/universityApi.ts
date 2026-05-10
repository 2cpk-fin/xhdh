import api from './axios'
import type { Page } from '../types/general'
import type { UniversityRequest, UniversityResponse } from '../types/university'

export const universityApi = {
    getAllUniversities: async (): Promise<UniversityResponse[]> => {
        const CACHE_KEY = 'universities';
        const CACHE_TTL = 5 * 60 * 1000;

        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, cachedAt } = JSON.parse(cached);
            if (Date.now() - cachedAt < CACHE_TTL) {
                return data;
            }
        }

        const { data } = await api.get<UniversityResponse[]>('/universities/all');
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, cachedAt: Date.now() }));
        return data;
    },

    getUniversities: async (
        page: number = 0,
        size: number = 15,
        sort: string = 'elo,desc',
        input?: string,
        tags?: string[]
    ): Promise<Page<UniversityResponse>> => {
        const { data } = await api.get<Page<UniversityResponse>>('/universities', {
            params: {
                page,
                size,
                sort,
                input: input?.trim() === '' ? undefined : input,
                tags: tags?.length ? tags : undefined
            },
            paramsSerializer: (params) => {
                const parts: string[] = []
                for (const [key, value] of Object.entries(params)) {
                    if (value === undefined || value === null) continue
                    if (Array.isArray(value)) {
                        value.forEach(v => parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`))
                    } else {
                        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
                    }
                }
                return parts.join('&')
            }
        });
        return data;
    },

    getAllTags: async (): Promise<string[]> => {
        const CACHE_KEY = 'university_tags';
        const CACHE_TTL = 24 * 60 * 60 * 1000;

        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, cachedAt } = JSON.parse(cached);
            if (Date.now() - cachedAt < CACHE_TTL) {
                return data;
            }
        }

        const { data } = await api.get<string[]>('/universities/tags');
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, cachedAt: Date.now() }));
        return data;
    },

    createUniversity: async (request: UniversityRequest): Promise<UniversityResponse> => {
        const { data } = await api.post<UniversityResponse>(`/universities/admin/create`, request);
        return data;
    },

    updateUniversity: async (id: number, request: UniversityRequest): Promise<UniversityResponse> => {
        const { data } = await api.patch<UniversityResponse>(`/universities/admin/update/${id}`, request);
        return data;
    },

    deleteUniversity: async (id: number): Promise<string> => {
        const { data } = await api.delete<string>(`/universities/admin/delete/${id}`);
        return data;
    }
}