import { useState, useEffect } from 'react';
import userApi from '../../../api/userApi';
import { AxiosError } from 'axios';
import { Loader2, UserX } from 'lucide-react';
import type { UserResponse } from '../../../types/user';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import NavBar from '../../../components/NavBar';
import ProfileBox from './ProfileBox';
import ProfileConfigBox from './ProfileConfigBox';

const ProfilePage = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem('refreshToken');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const data = await userApi.getUserByRefreshToken(token);
                setUser(data);
            } catch (err) {
                // Restored your original AxiosError handling here
                const axiosError = err as AxiosError<{ message: string }>;
                console.error(axiosError.response?.data?.message || 'Failed to load profile');
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] flex flex-col font-sans antialiased">
                <Header />
                <NavBar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-500" />
                        <span className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                            Loading Profile
                        </span>
                    </div>
                </main>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] flex flex-col font-sans antialiased">
                <Header />
                <NavBar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center border border-red-100 dark:border-red-900/50">
                            <UserX className="w-8 h-8 text-red-500" />
                        </div>
                        <span className="text-sm font-black text-red-500 uppercase tracking-widest">
                            Profile Not Found
                        </span>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] flex flex-col font-sans antialiased text-black dark:text-white">
            <Header />
            <NavBar />

            <main className="flex-grow container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto w-full transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
                    <ProfileBox user={user} />
                    <ProfileConfigBox user={user} onUserUpdate={setUser} />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;