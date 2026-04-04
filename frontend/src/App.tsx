import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DuelPage from './pages/DuelPage';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import SystemSettings from './pages/SystemSettings';
import GeneralSettings from './pages/GeneralSettings';
import ActivityPage from './pages/ActivityPage';
import AuthenticationSettings from './pages/AuthenticationSettings';
import NewsPage from './pages/NewsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import PlayPage from './pages/PlayPage';
import SearchPage from './pages/SearchPage';
import type React from 'react';
import AuthCallback from './pages/AuthCallback';
import { useEffect, useState, useCallback } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

    const syncTheme = useCallback(() => {
        const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
        setTheme(fromStorage);
        if (fromStorage === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        window.addEventListener('themeChange', syncTheme);
        syncTheme();
        return () => window.removeEventListener('themeChange', syncTheme);
    }, [syncTheme]);

    return (
        <BrowserRouter>
            <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8fafc] text-zinc-900'}`}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Protected Core Routes */}
                    <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                    <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                    <Route path="/duel" element={<ProtectedRoute><DuelPage /></ProtectedRoute>} />
                    <Route path="/play" element={<ProtectedRoute><PlayPage /></ProtectedRoute>} />
                    <Route path="/event" element={<ProtectedRoute><EventPage /></ProtectedRoute>} />
                    <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
                    <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                    {/* Settings Sub-routes */}
                    <Route path="/settings" element={<Navigate to="/settings/general" replace />} />
                    <Route path="/settings/general" element={<ProtectedRoute><GeneralSettings /></ProtectedRoute>} />
                    <Route path="/settings/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
                    <Route path="/settings/system" element={<ProtectedRoute><SystemSettings /></ProtectedRoute>} />
                    <Route path="/settings/auth" element={<ProtectedRoute><AuthenticationSettings /></ProtectedRoute>} />

                    {/* Fallback Routes */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="*" element={<div className="p-10 text-center font-bold">404 - Not Found</div>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;