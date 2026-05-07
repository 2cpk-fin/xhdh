import api from './axios'
import type { Page } from '../types/general'
import type { UniversityRequest, UniversityResponse } from '../types/university'

export const universityApi = {
    getUniversities: async (
        page: number = 0,
        size: number = 15,
        sort: string = 'elo,desc',
        input?: string,
        tagIds?: number[]
    ): Promise<Page<UniversityResponse>> => {
        const { data } = await api.get<Page<UniversityResponse>>('/universities', {
            params: {
                page,
                size,
                sort,
                ...(input && { input }),
                ...(tagIds?.length && { tagIds: tagIds.join(',') })
            }
        });
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