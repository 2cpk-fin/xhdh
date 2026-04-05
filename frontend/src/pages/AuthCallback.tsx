import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

useEffect(() => {
  const token = searchParams.get('token');
  const refreshToken = searchParams.get('refreshToken');
  
  if (token && refreshToken) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    navigate('/home');
  } else {
    navigate('/login?error=oauth_failed');
  }
}, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white animate-pulse text-lg font-medium">
        Finalizing authentication...
      </div>
    </div>
  );
};

export default AuthCallback;