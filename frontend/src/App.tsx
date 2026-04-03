import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage'; // Check your filename/path
import LoginPage from './pages/LoginPage';
import DuelPage from './pages/DuelPage';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import SettingsPage from './pages/SettingsPage';
import NewsPage from './pages/NewsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import type React from 'react';
import AuthCallback from './pages/AuthCallback';

// 🛡️ A simple wrapper to protect private pages later
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('token'); 
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

import { useEffect, useState } from 'react';

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
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Private Routes (The actual "xhdh" ranking logic) */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/duel" 
            element={
              <ProtectedRoute>
                <DuelPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/event" 
            element={
              <ProtectedRoute>
                <EventPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/news" 
            element={
              <ProtectedRoute>
                <NewsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<div className="p-10 text-center">404 - Not Found</div>} />
          <Route path="/auth/callback" element={<AuthCallback />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;