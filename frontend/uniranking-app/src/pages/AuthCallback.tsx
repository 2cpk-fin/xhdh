import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');

        if (token && refreshToken) {
            // Save tokens to storage (match your authApi's expected logic)
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            // Redirect to home now that we are authenticated
            navigate('/home');
        } else {
            // If tokens are missing, go back to login
            console.error("Auth failed: Missing tokens in URL");
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-zinc-600 font-medium">Finalizing secure connection...</p>
            </div>
        </div>
    );
};

export default AuthCallback;