import React from 'react';
import { User, Mail, Lock, UserPlus, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RegisterRequest } from '../types/auth';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

interface RegisterBoxProps {
    formData: RegisterRequest;
    loading: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleGoogleSignup: () => void;
    handleSignInLink: (e: React.MouseEvent) => void;
}

const RegisterBox: React.FC<RegisterBoxProps> = ({ formData, loading, handleChange, handleSubmit, handleGoogleSignup, handleSignInLink }) => {
    return (
        <div className="w-[448px] shrink-0 rounded-[2.5rem] border border-zinc-200 bg-white/90 backdrop-blur-md p-10 relative">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 border border-green-200">
                    <UserPlus className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-4xl font-black tracking-tight text-zinc-900">Create Account</h2>
                <p className="text-sm font-medium opacity-50 mt-2">Join the academic evaluation community</p>
            </div>

            {/* FIX: disable button while loading to prevent double-clicks during OAuth redirect */}
            <button
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full flex items-center justify-center py-4 px-6 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <GoogleIcon />}
                Sign up with Google
            </button>

            <div className="relative flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-zinc-500/10" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Or manual</span>
                <div className="flex-1 h-px bg-zinc-500/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30 group-focus-within:opacity-100 group-focus-within:text-green-500 transition-all" />
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        className="w-full py-4 pl-12 pr-4 rounded-2xl border border-zinc-200 bg-zinc-50 outline-none focus:border-green-500/50 transition-all font-medium text-zinc-900"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30 group-focus-within:opacity-100 group-focus-within:text-green-500 transition-all" />
                    <input
                        name="email"
                        type="email" // FIX: was type="text" — now enables browser email validation and correct mobile keyboard
                        placeholder="Academic Email"
                        className="w-full py-4 pl-12 pr-4 rounded-2xl border border-zinc-200 bg-zinc-50 outline-none focus:border-green-500/50 transition-all font-medium text-zinc-900"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30 group-focus-within:opacity-100 group-focus-within:text-green-500 transition-all" />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full py-4 pl-12 pr-4 rounded-2xl border border-zinc-200 bg-zinc-50 outline-none focus:border-green-500/50 transition-all font-medium text-zinc-900"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 mt-4 uppercase tracking-widest text-xs">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    {loading ? "Saving..." : "Register Now"}
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
    );
};

export default RegisterBox;