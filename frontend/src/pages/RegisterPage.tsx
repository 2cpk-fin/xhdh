import React, { useState, useEffect, useMemo } from 'react';
import { User, Mail, Lock, UserPlus, ArrowLeft, Loader2, ShieldCheck, Star, Sun, Moon } from 'lucide-react';
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

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isAnimateOut, setIsAnimateOut] = useState(false);
  const [isAnimateIn, setIsAnimateIn] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  useEffect(() => {
    setIsAnimateIn(true);
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
  const cardBg = isDark ? 'bg-[#121212]/80 backdrop-blur-xl border-zinc-800' : 'bg-white/90 backdrop-blur-md border-zinc-200 shadow-2xl';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200';

  const handleSignInLink = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAnimateOut(true);
    setTimeout(() => {
      navigate('/login');
    }, 800);
  };

  const handleGoogleSignup = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setAnnouncement({ message: "Passwords do not match", isSuccess: false });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setAnnouncement({
        message: `Welcome aboard, ${response.data.username}! Redirecting...`,
        isSuccess: true
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setAnnouncement({ message: err.response?.data?.message || "Registration failed.", isSuccess: false });
    } finally {
      setLoading(false);
    }
  };

  const ComplexAnimatedCircuitry = useMemo(() => {
    const strokeColor = isDark ? "rgba(34, 197, 94, 0.2)" : "rgba(22, 163, 74, 0.1)";
    const nodeColor = isDark ? "#22c55e" : "#16a34a";
    const flowColor = isDark ? "#4ade80" : "#22c55e";

    const paths = [
      "M -600 100 H 600", "M -600 250 H 650", "M -600 400 H 550", "M -600 550 H 700",
      "M -600 700 H 500", "M -600 850 H 850", "M 400 100 V 250 L 300 350 V 400",
      "M 100 250 V 400 L 200 500", "M 250 400 V 550 L 50 650", "M -100 550 V 700 L 0 850"
    ];

    const nodes = [
      { cx: 400, cy: 100, r: 8, delay: "0s" }, { cx: 100, cy: 250, r: 10, delay: "1.2s" },
      { cx: 250, cy: 400, r: 7, delay: "2.5s" }, { cx: -100, cy: 550, r: 9, delay: "0.8s" },
      { cx: 0, cy: 850, r: 6, delay: "1.8s" }
    ];

    return (
        <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ease-in-out 
          ${isAnimateOut ? 'translate-x-[20%] opacity-0' : isAnimateIn ? 'translate-x-0 opacity-60 lg:opacity-80' : 'translate-x-[20%] opacity-0'}`}>
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <filter id="circuitGlowGreen">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <g transform="rotate(-45 200 400)" stroke={strokeColor} strokeWidth="2" fill="none">
              {paths.map((d, i) => <path key={`p-${i}`} d={d} />)}

              <g filter="url(#circuitGlowGreen)">
                {[0, 1, 2].map((i) => (
                    <circle key={`dot-1-${i}`} r="2.5" fill={flowColor}>
                      <animateMotion path={paths[0]} dur="4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                    </circle>
                ))}
                {[0, 1, 2].map((i) => (
                    <circle key={`dot-2-${i}`} r="2" fill={flowColor} opacity="0.6">
                      <animateMotion path={paths[6]} dur="5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                ))}
              </g>

              <g filter="url(#circuitGlowGreen)">
                {nodes.map((node, i) => (
                    <circle
                        key={`n-${i}`}
                        cx={node.cx}
                        cy={node.cy}
                        r={node.r}
                        fill={nodeColor}
                        className="animate-power-surge-green"
                        style={{ animationDelay: node.delay }}
                    />
                ))}
              </g>
            </g>
          </svg>

          <style>{`
          @keyframes powerSurgeGreen {
            0%, 100% { opacity: 0.3; transform: scale(1); filter: brightness(1); }
            20% { opacity: 1; transform: scale(1.15); filter: brightness(2.5) drop-shadow(0 0 8px ${nodeColor}); }
            40% { opacity: 0.3; transform: scale(1); filter: brightness(1); }
          }
          .animate-power-surge-green {
            animation: powerSurgeGreen 4s infinite linear;
            transform-origin: center;
            transform-box: fill-box;
          }
        `}</style>
        </div>
    );
  }, [isDark, isAnimateIn, isAnimateOut]);

  return (
      <div className={`min-h-screen flex items-center relative overflow-hidden transition-colors duration-300 ${bgMain}`}>

        {ComplexAnimatedCircuitry}

        {announcement && (
            <AnnouncementBox
                message={announcement.message}
                isSuccess={announcement.isSuccess}
                duration={4000}
                onDismiss={() => setAnnouncement(null)}
            />
        )}

        <div className={`w-full flex justify-end px-12 lg:px-64 z-10 transition-all duration-700 ease-in-out 
          ${isAnimateOut ? 'translate-x-[100%] opacity-0' : isAnimateIn ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0'}`}>
          <div className={`max-w-md w-full rounded-[2.5rem] border p-10 relative transition-all duration-300 ${cardBg}`}>
            <button
                onClick={toggleTheme}
                className={`absolute top-8 right-8 p-3 rounded-xl border transition-all active:scale-95 ${
                    isDark ? 'bg-white/5 border-zinc-800 text-yellow-500' : 'bg-zinc-50 border-zinc-200 text-green-600'
                }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 border border-green-500/20">
                <UserPlus className="w-8 h-8 text-green-500" />
              </div>
              <h2 className={`text-4xl font-black tracking-tight ${textColor}`}>Create Account</h2>
              <p className="text-sm font-medium opacity-50 mt-2">Join the academic evaluation community</p>
            </div>

            <button
                onClick={handleGoogleSignup}
                className={`w-full flex items-center justify-center py-4 px-6 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] border mb-6 ${
                    isDark ? 'bg-white/5 border-zinc-800 hover:bg-white/10 text-white' : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-900 shadow-sm'
                }`}
            >
              <GoogleIcon />
              Sign up with Google
            </button>

            <div className="relative flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-zinc-500/10" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Or manual</span>
              <div className="flex-1 h-px bg-zinc-500/10" />
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30 group-focus-within:opacity-100 group-focus-within:text-green-500 transition-all" />
                <input
                    type="text"
                    required
                    placeholder="Username"
                    className={`w-full py-4 pl-12 pr-4 rounded-2xl border outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium ${inputBg} ${textColor}`}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30 group-focus-within:opacity-100 group-focus-within:text-green-500 transition-all" />
                <input
                    type="email"
                    required
                    placeholder="Academic Email"
                    className={`w-full py-4 pl-12 pr-4 rounded-2xl border outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium ${inputBg} ${textColor}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30 group-focus-within:opacity-100 group-focus-within:text-green-500 transition-all" />
                <input
                    type="password"
                    required
                    placeholder="Password (min 8 chars)"
                    className={`w-full py-4 pl-12 pr-4 rounded-2xl border outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium ${inputBg} ${textColor}`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30 group-focus-within:opacity-100 group-focus-within:text-green-500 transition-all" />
                <input
                    type="password"
                    required
                    placeholder="Confirm Password"
                    className={`w-full py-4 pl-12 pr-4 rounded-2xl border outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium ${inputBg} ${textColor}`}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-green-500/20 mt-4 uppercase tracking-widest text-xs"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {loading ? "Creating Account..." : "Register Now"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-500/10 text-center">
              <p className="text-sm font-medium opacity-50">
                Already have an account?{' '}
                <Link to="/login" onClick={handleSignInLink} className="text-green-600 font-black hover:underline underline-offset-4">
                  Sign In <ArrowLeft className="w-4 h-4 inline-block ml-1 rotate-180" />
                </Link>
              </p>
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

export default RegisterPage;