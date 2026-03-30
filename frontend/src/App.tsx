import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage'; // Check your filename/path
import LoginPage from './pages/LoginPage';
import DuelPage from './pages/DuelPage';
import type React from 'react';

// 🛡️ A simple wrapper to protect private pages later
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('token'); 
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Private Routes (The actual "xhdh" ranking logic) */}
          <Route 
            path="/duel" 
            element={
              <ProtectedRoute>
                <DuelPage />
              </ProtectedRoute>
            } 
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div className="p-10 text-center">404 - Not Found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;