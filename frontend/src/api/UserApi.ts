import api from './axios';
import type { UserResponse } from '../types/User';

const UserApi = {
    getUser: async (username: string): Promise<UserResponse> => {
        const response = await api.get<UserResponse>(`/users/${username}`);
        return response.data;
    },

    updateEmail: async (id: number, newEmail: string): Promise<void> => {
        await api.patch(`/users/${id}/email`, null, {
            params: { newEmail },
        });
    },


    updatePassword: async (id: number, newPassword: string): Promise<void> => {
        // Sending as a raw string body to match the @RequestBody String
        await api.patch(`/users/${id}/password`, newPassword, {
            headers: { 'Content-Type': 'text/plain' },
        });
    },

    updateProfileImage: async (id: number, imageUrl: string): Promise<void> => {
        await api.patch(`/users/${id}/profile-image`, null, {
            params: { imageUrl },
        });
    },

    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
};

export default UserApi;