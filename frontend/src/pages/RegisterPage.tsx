import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AnnouncementBox from '../components/AnnouncementBox';
import SpaceBackground from '../components/SpaceBackground';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);
  const [showPlanet, setShowPlanet] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAnnouncement(null);


    try {
      // Send registration request to backend
      const response = await api.post('/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Success response from backend
      const { username } = response.data;
      const successMsg = `Registration successful! Welcome, ${username}!`;
      
      setAnnouncement({ 
        message: successMsg, 
        isSuccess: true 
      });

      // Clear form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setShowPlanet(true);

      // Navigate to login after announcement is shown
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err: any) {
      // Error response from backend
      const errorMessage = err.response?.data?.message || "Registration failed. Try again.";
      setError(errorMessage);
      setAnnouncement({ 
        message: errorMessage, 
        isSuccess: false 
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      <SpaceBackground showPlanet={showPlanet} />

      {/* Announcement Box */}
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

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
            <input 
              type="text"
              required
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
              placeholder="Confirm Password"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center font-medium">{error}</div>}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-900/20">
            <UserPlus className="w-5 h-5" />
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;