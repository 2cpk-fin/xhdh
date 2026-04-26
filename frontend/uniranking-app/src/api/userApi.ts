import api from './axios';
import type { UserResponse } from '../types/user';

const userApi = {
    getUserByRefreshToken: async (refreshToken: string): Promise<UserResponse> => {
        // Changed from GET with params to POST with body — passing tokens in query strings
        // is insecure (logged by servers/proxies) and fragile. POST body is safer.
        const response = await api.post<UserResponse>(`/users/me`, { refreshToken });
        return response.data;
    },

    updateUsername: async (id: number, newUsername: string): Promise<UserResponse> => {
        const response = await api.patch<UserResponse>(`/users/${id}/username`, { newUsername });
        return response.data;
    },

    updateEmail: async (id: number, newEmail: string): Promise<UserResponse> => {
        // Changed from params to body for better security and standard practice
        const response = await api.patch<UserResponse>(`/users/${id}/email`, { newEmail });
        return response.data;
    },

    updatePassword: async (id: number, newPassword: string): Promise<UserResponse> => {
        // Wrapped password in an object to ensure JSON parsing works on the BE
        const response = await api.patch<UserResponse>(`/users/${id}/password`, { newPassword });
        return response.data;
    },

    updateProfileImage: async (id: number, imageProfile: string): Promise<UserResponse> => {
        // Changed from params to body
        const response = await api.patch<UserResponse>(`/users/${id}/profile-image`, { imageProfile });
        return response.data;
    },

    deleteUser: async (id: number): Promise<string> => {
        const response = await api.delete<string>(`/users/${id}`, {
            responseType: 'text'
        });
        return response.data;
    }
}

export default userApi;