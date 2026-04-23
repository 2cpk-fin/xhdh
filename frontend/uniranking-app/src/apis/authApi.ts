import api from 'axios';
import type { RegisterRequest, LoginRequest, AuthResponse, LogoutRequest, LogoutResponse } from '../types/auth';

const authApi = {
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);

        // After a successful login, we store the tokens
        const { token, refreshToken } = response.data;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);

        return response.data;
    },

    logout: async (data: LogoutRequest): Promise<LogoutResponse> => {
        // Even though your interceptor adds the Bearer token, 
        // your type suggests sending specific tokens in the body.
        const response = await api.post<LogoutResponse>('/auth/logout', data);

        // Clean up the browser storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        return response.data;
    }
};

export default authApi;