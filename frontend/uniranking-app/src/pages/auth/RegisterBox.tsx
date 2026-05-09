import React from 'react';
import { User, Mail, Lock, UserPlus, ArrowLeft, Loader2, ShieldCheck, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RegisterRequest } from '../../types/auth';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

interface RegisterBoxProps {
    formData: RegisterRequest & { confirmPassword?: string };
    loading: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleGoogleSignup: () => void;
    handleSignInLink: (e: React.MouseEvent) => void;
    isDarkMode: boolean;           // Added prop
    toggleDarkMode: () => void;    // Added prop
}

const RegisterBox: React.FC<RegisterBoxProps> = ({
    formData, loading, handleChange, handleSubmit, handleGoogleSignup, handleSignInLink, isDarkMode, toggleDarkMode
}) => {

    return (
        <div className={`w-[448px] shrink-0 rounded-[2.5rem] border p-10 relative transition-all duration-300 shadow-xl
            ${isDarkMode ? 'bg-black border-zinc-800 shadow-2xl backdrop-blur-none' : 'bg-white/90 border-zinc-200 backdrop-blur-md'}`}>

            <button
                onClick={toggleDarkMode}
                className={`absolute top-8 right-8 p-2.5 rounded-xl border transition-all active:scale-95
                           ${isDarkMode ? 'bg-black border-zinc-800 text-green-400 hover:bg-zinc-900' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-white'}`}
            >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex flex-col items-center text-center mb-8 mt-2">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border
                                ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-green-50 border-green-200'}`}>
                    <UserPlus className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                </div>
                <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Create Account</h2>
                <p className={`text-sm font-medium mt-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Join the academic evaluation community</p>
            </div>

            <button
                onClick={handleGoogleSignup}
                disabled={loading}
                className={`w-full flex items-center justify-center py-4 px-6 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] border mb-6 disabled:opacity-50
                           ${isDarkMode ? 'bg-black border-zinc-800 text-white hover:bg-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-900'}`}
            >
                {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <GoogleIcon />}
                Sign up with Google
            </button>

            <div className="relative flex items-center gap-4 mb-8">
                <div className={`flex-1 h-px ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Or manual</span>
                <div className={`flex-1 h-px ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all
                                    ${isDarkMode ? 'text-zinc-500 group-focus-within:text-green-400' : 'text-zinc-400 group-focus-within:text-green-500'}`} />
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        className={`w-full py-4 pl-12 pr-4 rounded-2xl border outline-none transition-all font-medium placeholder:text-zinc-400
                                   ${isDarkMode
                                ? 'bg-black border-zinc-800 text-white focus:border-green-500'
                                : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:bg-white focus:border-green-500'}`}
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all
                                    ${isDarkMode ? 'text-zinc-500 group-focus-within:text-green-400' : 'text-zinc-400 group-focus-within:text-green-500'}`} />
                    <input
                        name="email"
                        type="email"
                        placeholder="Academic Email"
                        className={`w-full py-4 pl-12 pr-4 rounded-2xl border outline-none transition-all font-medium placeholder:text-zinc-400
                                   ${isDarkMode
                                ? 'bg-black border-zinc-800 text-white focus:border-green-500'
                                : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:bg-white focus:border-green-500'}`}
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all
                                    ${isDarkMode ? 'text-zinc-500 group-focus-within:text-green-400' : 'text-zinc-400 group-focus-within:text-green-500'}`} />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className={`w-full py-4 pl-12 pr-4 rounded-2xl border outline-none transition-all font-medium placeholder:text-zinc-400
                                   ${isDarkMode
                                ? 'bg-black border-zinc-800 text-white focus:border-green-500'
                                : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:bg-white focus:border-green-500'}`}
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all
                                    ${isDarkMode ? 'text-zinc-500 group-focus-within:text-green-400' : 'text-zinc-400 group-focus-within:text-green-500'}`} />
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        className={`w-full py-4 pl-12 pr-4 rounded-2xl border outline-none transition-all font-medium placeholder:text-zinc-400
                                   ${isDarkMode
                                ? 'bg-black border-zinc-800 text-white focus:border-green-500'
                                : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:bg-white focus:border-green-500'}`}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={loading} className={`w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 mt-6 uppercase tracking-widest text-xs shadow-lg ${isDarkMode ? 'shadow-green-900/40' : 'shadow-green-500/20'}`}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    {loading ? "Saving..." : "Register Now"}
                </button>
            </form>

            <div className={`mt-8 pt-8 border-t text-center ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Already have an account?{' '}
                    <Link to="/login" onClick={handleSignInLink} className={`font-black hover:underline underline-offset-4 transition-colors ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'}`}>
                        Sign In <ArrowLeft size={14} className="inline-block ml-1 rotate-180" />
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterBox;