import { useState, useEffect } from 'react';
import userApi from '../api/userApi';
import { AxiosError } from 'axios';
import type { UserResponse } from '../types/user';

import Header from '../components/Header';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import ProfileBox from '../components/ProfileBox';
import ProfileConfigBox from '../components/ProfileConfigBox';

const ProfilePage = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Find user by refresh token
    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem('refreshToken');
            if (!token) {
                alert("No session found. Please login.");
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

    if (loading) return <div className="flex h-screen items-center justify-center font-black text-2xl uppercase">Loading...</div>;
    if (!user) return <div className="flex h-screen items-center justify-center font-black text-2xl uppercase text-red-500">Profile not found.</div>;

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-sans antialiased text-black">
            <Header />
            <NavBar />

            <main className="flex-grow container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <ProfileBox user={user} />
                    <ProfileConfigBox user={user} onUserUpdate={(updatedUser) => setUser(updatedUser)} />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;