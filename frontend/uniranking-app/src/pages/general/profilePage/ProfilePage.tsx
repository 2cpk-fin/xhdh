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
            <div className="min-h-screen bg-[var(--bg-main)] flex flex-col font-sans antialiased transition-colors duration-300">
                <Header />
                <div className="flex flex-1">
                    <NavBar />
                    <main className="flex-grow flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-purple)]" />
                            <span className="text-xs font-black text-[var(--text-primary)] opacity-40 uppercase tracking-widest">
                                Loading Profile
                            </span>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex flex-col font-sans antialiased text-[var(--text-primary)] transition-colors duration-300">
            <Header />
            <div className="flex flex-1">
                <NavBar />
                <main className="flex-grow container mx-auto px-6 py-16">
                    <div className="max-w-4xl mx-auto w-full transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
                        {user ? (
                            <>
                                <ProfileBox user={user} />
                                <ProfileConfigBox user={user} onUserUpdate={setUser} />
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-4 mt-20">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                    <UserX className="w-8 h-8 text-red-500" />
                                </div>
                                <span className="text-sm font-black text-red-500 uppercase tracking-widest">
                                    Profile Not Found
                                </span>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;