import axios from 'axios';

// VITE_API_BASE_URL is the render backend URL
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 1. Identify if this request was an authentication attempt
        const isLoginRequest = originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/login');
        const isRegisterRequest = originalRequest.url.includes('/users/register') || originalRequest.url.includes('/register');

        // 2. Only attempt refresh/redirect if it's NOT a login/register failure
        if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isRegisterRequest) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    // FIXED: Typo in URL and hardcoded localhost
                    const refreshResponse = await axios.post(`${baseURL}/api/auth/refresh`, null, {
                        params: { refreshToken: refreshToken }
                    });

                    const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data;
                    localStorage.setItem('token', newToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.clear();
                    window.location.href = '/login'; // Hard reload only if refresh fails
                    return Promise.reject(refreshError);
                }
            } else {
                localStorage.removeItem('token');
                window.location.href = '/login'; // Hard reload if no refresh token exists
                return Promise.reject(error);
            }
        }

        // 3. If it's a 401 on the login/register page, just reject the promise.
        return Promise.reject(error);
    }
);

export default api;