import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Lock, LogIn, UserPlus, ShieldCheck, Star, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AnnouncementBox from '../components/AnnouncementBox';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [isAnimateIn, setIsAnimateIn] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [announcement, setAnnouncement] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsAnimateIn(true);
    });

    const syncTheme = () => {
      const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(fromStorage);
    };
    window.addEventListener('themeChange', syncTheme);
    return () => window.removeEventListener('themeChange', syncTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    window.dispatchEvent(new Event('themeChange'));
  };

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
  const cardBg = isDark ? 'bg-[#121212] border-zinc-800 shadow-none' : 'bg-white border-zinc-200 shadow-2xl shadow-blue-500/5';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200';

  const handleGoogleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const { accessToken, refreshToken } = response.data; // Destructure new keys
      
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setAnnouncement({ message: 'Login successful!', isSuccess: true });
        setTimeout(() => navigate('/home'), 1000);
      }
    } catch (err: any) {
      setAnnouncement({ message: 'Invalid credentials.', isSuccess: false });
    }
  };

  const handleJoinNow = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      navigate('/register');
    }, 800);
  };

  const ComplexAnimatedCircuitry = useMemo(() => {
    const strokeColor = isDark ? "rgba(167, 139, 250, 0.25)" : "rgba(109, 40, 217, 0.15)";
    const nodeColor = isDark ? "#a855f7" : "#7c3aed";
    const flowColor = isDark ? "#d8b4fe" : "#a855f7";

    const paths = [
      "M 400 100 H 1600", "M 350 250 H 1600", "M 450 400 H 1600", "M 300 550 H 1600",
      "M 500 700 H 1600", "M 150 850 H 1600", "M 600 100 V 250 L 700 350 V 400",
      "M 900 250 V 400 L 800 500", "M 750 400 V 550 L 950 650", "M 1100 550 V 700 L 1000 850"
    ];

    const nodes = [
      { cx: 600, cy: 100, r: 8, delay: "0s" }, { cx: 900, cy: 250, r: 10, delay: "1.2s" },
      { cx: 750, cy: 400, r: 7, delay: "2.5s" }, { cx: 1100, cy: 550, r: 9, delay: "0.8s" },
      { cx: 1000, cy: 850, r: 6, delay: "1.8s" }
    ];

    return (
        <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ease-in-out 
          ${isExiting ? 'translate-x-[-15%] opacity-0' : isAnimateIn ? 'translate-x-0 opacity-60 lg:opacity-80' : 'translate-x-[-15%] opacity-0'}`}>
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <filter id="circuitGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <g transform="rotate(-45 800 400)" stroke={strokeColor} strokeWidth="2" fill="none">
              {paths.map((d, i) => <path key={`p-${i}`} d={d} />)}

              <g filter="url(#circuitGlow)">
                {[0, 1, 2].map((i) => (
                    <circle key={`dot-1-${i}`} r="3.5" fill={flowColor}>
                      <animateMotion path={paths[0]} dur="4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                    </circle>
                ))}
                {[0, 1, 2].map((i) => (
                    <circle key={`dot-2-${i}`} r="3" fill={flowColor} opacity="0.6">
                      <animateMotion path={paths[6]} dur="5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                ))}
              </g>

              <g filter="url(#circuitGlow)">
                {nodes.map((node, i) => (
                    <circle
                        key={`n-${i}`}
                        cx={node.cx}
                        cy={node.cy}
                        r={node.r}
                        fill={nodeColor}
                        className="animate-power-surge"
                        style={{ animationDelay: node.delay }}
                    />
                ))}
              </g>
            </g>
          </svg>

          <style>{`
          @keyframes powerSurge {
            0%, 100% { opacity: 0.3; transform: scale(1); filter: brightness(1); }
            20% { opacity: 1; transform: scale(1.15); filter: brightness(2.5) drop-shadow(0 0 8px ${nodeColor}); }
            40% { opacity: 0.3; transform: scale(1); filter: brightness(1); }
          }
          .animate-power-surge {
            animation: powerSurge 4s infinite linear;
            transform-origin: center;
            transform-box: fill-box;
          }
        `}</style>
        </div>
    );
  }, [isDark, isExiting, isAnimateIn]);

  return (
      <div className={`min-h-screen flex items-center relative overflow-hidden transition-colors duration-300 ${bgMain}`}>
        {ComplexAnimatedCircuitry}
        {announcement && (
            <AnnouncementBox message={announcement.message} isSuccess={announcement.isSuccess} duration={4000} onDismiss={() => setAnnouncement(null)} />
        )}

        <div className={`w-full flex justify-start px-12 lg:px-64 z-10 transition-all duration-1000 ease-in-out 
          ${isExiting ? 'translate-x-[-100%] opacity-0' : isAnimateIn ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0'}`}>
          <div className={`max-w-md w-full rounded-[2.5rem] border p-10 relative transition-all duration-300 ${cardBg}`}>
            <button onClick={toggleTheme} className={`absolute top-8 right-8 p-3 rounded-xl border transition-all active:scale-95 ${isDark ? 'bg-white/5 border-zinc-800 text-yellow-500' : 'bg-zinc-50 border-zinc-200 text-purple-600'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/20">
                <ShieldCheck className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className={`text-4xl font-black tracking-tight ${textColor}`}>Welcome Back</h2>
              <p className="text-sm font-medium opacity-50 mt-2">Sign in to the global university community</p>
            </div>

            <button onClick={handleGoogleLogin} className={`w-full flex items-center justify-center py-4 px-6 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] border mb-6 ${isDark ? 'bg-white/5 border-zinc-800 hover:bg-white/10 text-white' : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-900 shadow-sm'}`}>
              <GoogleIcon /> Continue with Google
            </button>

            <div className="relative flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-zinc-500/10" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Or email</span>
              <div className="flex-1 h-px bg-zinc-500/10" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30 group-focus-within:opacity-100 group-focus-within:text-purple-500 transition-all" />
                <input type="email" required placeholder="Academic Email" className={`w-full py-4 pl-12 pr-4 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium ${inputBg} ${textColor}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30 group-focus-within:opacity-100 group-focus-within:text-purple-500 transition-all" />
                <input type="password" required placeholder="Password" className={`w-full py-4 pl-12 pr-4 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium ${inputBg} ${textColor}`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-purple-500/20 mt-4 uppercase tracking-widest text-xs">
                <LogIn className="w-4 h-4" /> Enter Community
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-500/10 text-center">
              <p className="text-sm font-medium opacity-50">Don't have an account? <Link to="/register" onClick={handleJoinNow} className="text-purple-500 font-black hover:underline underline-offset-4">Join now <UserPlus className="w-4 h-4 inline-block ml-1" /></Link></p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 flex gap-6 opacity-30 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap z-10 transition-colors duration-300">
          <span>© 2026 University Ranking</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> Verified Voting</span>
        </div>
      </div>
  );
};

export default LoginPage;