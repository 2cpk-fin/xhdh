import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AnnouncementBox from '../components/AnnouncementBox';
import SpaceBackground from '../components/SpaceBackground';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState<
    | { message: string; isSuccess: boolean }
    | null
  >(null);
  const [showPlanet, setShowPlanet] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAnnouncement(null);

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Backend should return token/refreshToken in AuthResponse
      const { token, refreshToken } = response.data;

      if (token && refreshToken) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setAnnouncement({
          message: 'Login successful! Redirecting...',
          isSuccess: true
        });
        setShowPlanet(true);

        setTimeout(() => {
          navigate('/duel');
        }, 1200);
      } else {
        throw new Error('Login failed: token or refresh token missing.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials.';
      setError(errorMessage);
      setAnnouncement({ message: errorMessage, isSuccess: false });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      <SpaceBackground showPlanet={showPlanet} />

      {announcement && (
        <AnnouncementBox
          message={announcement.message}
          isSuccess={announcement.isSuccess}
          duration={5000}
          onDismiss={() => setAnnouncement(null)}
        />
      )}

      <div className="relative z-20 max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <Link to="/register" className="text-slate-500 hover:text-blue-400 flex items-center gap-2 mb-6 text-sm transition-colors">
          <UserPlus className="w-4 h-4" /> Create an Account
        </Link>

        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-slate-400 mb-8 text-sm">Sign in to participate in university community voting</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-900/20"
          >
            <LogIn className="w-5 h-5" />
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
