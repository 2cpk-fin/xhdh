import api from './axios';
import type { NewsResponse } from '../types/news';

const newsApi = {
    getNews: async (page: number = 0): Promise<NewsResponse> => {
        const response = await api.get<NewsResponse>(`/news?page=${page}`);
        return response.data;
    }
};

export default newsApi;