import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AnnouncementBox from '../components/AnnouncementBox';
import SpaceBackground from '../components/SpaceBackground';

interface Announcement {
  message: string;
  isSuccess: boolean;
}

// Inline Google SVG Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [showPlanet, setShowPlanet] = useState(false);

  // Trigger Spring Boot OAuth2 auto-register/login
  const handleGoogleSignup = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAnnouncement(null);

    // 1. Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
    }

    setLoading(true);

    try {
      // Send registration request to backend
      const response = await api.post('/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Success logic
      const { username } = response.data;
      setAnnouncement({ 
        message: `Registration successful! Welcome, ${username}!`, 
        isSuccess: true 
      });

      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      setShowPlanet(true);

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed. Try again.";
      setError(errorMessage);
      setAnnouncement({ 
        message: errorMessage, 
        isSuccess: false 
      });
    } finally {
      setLoading(false);
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
        <Link to="/login" className="text-slate-500 hover:text-blue-400 flex items-center gap-2 mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-slate-400 mb-8 text-sm">Participate in university community votes on our platform</p>

        {/* Google OAuth Auto-Register Button */}
        <button 
          onClick={handleGoogleSignup}
          type="button" 
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-3 rounded-xl flex items-center justify-center transition-colors active:scale-95 mb-6 shadow-sm"
        >
          <GoogleIcon />
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-slate-900 text-slate-500">Or register manually</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
            <input 
              type="text"
              required
              value={formData.username}
              placeholder="Username"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
            <input 
              type="email"
              required
              value={formData.email}
              placeholder="Email (e.g. example@example.com)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
            <input 
              type="password"
              required
              value={formData.password}
              placeholder="Password (min 8 chars)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
            <input 
              type="password"
              required
              value={formData.confirmPassword}
              placeholder="Confirm Password"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center font-medium animate-shake">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-900/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;