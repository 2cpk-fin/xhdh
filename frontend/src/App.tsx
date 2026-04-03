import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DuelPage from './pages/DuelPage';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import SettingsPage from './pages/SettingsPage';
import NewsPage from './pages/NewsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import PlayPage from './pages/PlayPage';
import type React from 'react';
import AuthCallback from './pages/AuthCallback';
import Footer from './components/Footer'; // Import Footer here
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('token'); 
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const onThemeChange = () => setTheme((localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  return (
    <BrowserRouter>
      {/* Added flex flex-col and min-h-screen here. 
         The Footer will now stay at the bottom of the viewport 
      */}
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/duel" element={<ProtectedRoute><DuelPage /></ProtectedRoute>} />
            <Route path="/play" element={<ProtectedRoute><PlayPage /></ProtectedRoute>} />
            <Route path="/event" element={<ProtectedRoute><EventPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<div className="p-10 text-center">404 - Not Found</div>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </div>

        {/* 🛡️ Persistent Footer across all pages */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;