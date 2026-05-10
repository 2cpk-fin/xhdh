import api from './axios';
import type { SupportRequest, SupportResponse, SupportSlice, SupportPage } from '../types/support';

const BASE_URL = '/support';

export const supportApi = {

    createSupport: async (request: SupportRequest): Promise<SupportResponse> => {
        const { data } = await api.post<SupportResponse>(`${BASE_URL}/create`, request);
        return data;
    },

    getMySupports: async (page: number = 0): Promise<SupportSlice> => {
        const { data } = await api.get<SupportSlice>(`${BASE_URL}/get`, {
            params: { page }
        });
        return data;
    },

    updateSupport: async (supportId: number, request: SupportRequest): Promise<SupportResponse> => {
        const { data } = await api.put<SupportResponse>(`${BASE_URL}/update/${supportId}`, request);
        return data;
    },

    deleteSupport: async (supportId: number): Promise<void> => {
        await api.delete(`${BASE_URL}/delete/${supportId}`);
    },

    getAllSupportsAdmin: async (page: number = 0): Promise<SupportPage> => {
        const { data } = await api.get<SupportPage>(`${BASE_URL}/admin/all`, {
            params: { page }
        });
        return data;
    }
};