import api from './axios'
import type { Page } from '../types/general'
import type { UniversityResponse } from '../types/university'

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
}