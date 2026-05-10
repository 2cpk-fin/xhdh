import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors are gatekeepers that run before a request leaves or after a response arrives.
// They are perfect for attaching JWT tokens or global error logging.

// The config object contains everything about the URL, method, headers, and data.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); // Find your JWT
        if (token) { // Verify if token exists
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error) // Error handler
);

api.interceptors.response.use(
    (response) => response, // Pass the Response to the BE if succeed
    async (error) => { // If sth goes wrong, axios triggers this function
        const originalRequest = error.config;

        // Identify if this request was an authentication attempt
        // Adjust these strings to match your exact backend endpoints
        const isLoginRequest = originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/login');
        const isRegisterRequest = originalRequest.url.includes('/auth/register') || originalRequest.url.includes('/register');

        // Only attempt refresh/redirect if it's NOT a login/register failure
        if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isRegisterRequest) {
            originalRequest._retry = true;

            // Attempting the Refresh
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const refreshResponse = await axios.post('https://xhdh-api.onrender.com/api/auth/refresh', {
                        refreshToken: refreshToken
                    });

                    const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data;
                    localStorage.setItem('accessToken', newToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
                catch (refreshError) {
                    console.log(refreshError);
                    // localStorage.clear();
                    // window.location.href = '/login'; // Hard reload only if refresh fails
                    return Promise.reject(refreshError);
                }
            }
            else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('token'); // Remove old key for backward compatibility
                window.location.href = '/login'; // Hard reload if no refresh token exists
                return Promise.reject(error);
            }
        }

        // If it's a 401 on the login/register page, just reject the promise.
        // This allows your React catch(err) block to show the error message.
        return Promise.reject(error);
    }
);

export default api;