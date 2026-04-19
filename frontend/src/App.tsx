import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, useCallback} from 'react';

// Page Imports
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DuelPage from './pages/DuelPage';
import PlayPage from './pages/PlayPage';
import EventPage from './pages/EventPage';
import LeaderboardPage from "./pages/LeaderboardPage";
import NewsPage from './pages/NewsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import GeneralSettings from './pages/GeneralSettings';
import ActivityPage from './pages/ActivityPage';
import SystemSettings from './pages/SystemSettings';
import AuthenticationSettings from './pages/AuthenticationSettings';

/**
 * 1. Protected Route Component
 * Prevents unauthorized access to core features.
 * Matches the 'accessToken' key used in your LoginPage/AuthCallback.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Make sure this matches what you set in LoginPage/AuthCallback
    const isAuthenticated = !!localStorage.getItem('accessToken'); 
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AuthListener = () => {
    useEffect(() => {
    const syncAuth = (e: StorageEvent) => {
        // If accessToken is removed in another tab, redirect this tab to login
        if (e.key === 'accessToken' && !e.newValue) {
            window.location.href = '/login';
        }
    };

    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
}, []);

    return null;
};

/**
 * 3. Main App Component
 */
function App() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => 
        (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light'
    );

    // Synchronize Tailwind dark mode class with local state
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
            {/* The AuthListener must be inside BrowserRouter to use navigate() */}
            <AuthListener />
            
            <div className={`min-h-screen transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8fafc] text-zinc-900'
            }`}>
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
                    <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
                    <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
                    <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                    {/* Settings Sub-routes with auto-redirect to General */}
                    <Route path="/settings" element={<Navigate to="/settings/general" replace />} />
                    <Route path="/settings/general" element={<ProtectedRoute><GeneralSettings /></ProtectedRoute>} />
                    <Route path="/settings/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
                    <Route path="/settings/system" element={<ProtectedRoute><SystemSettings /></ProtectedRoute>} />
                    <Route path="/settings/auth" element={<ProtectedRoute><AuthenticationSettings /></ProtectedRoute>} />

                    {/* Root & Fallback Routes */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest opacity-20">
                            404 — System Error: Route Not Found
                        </div>
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;