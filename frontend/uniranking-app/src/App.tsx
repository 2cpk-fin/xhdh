import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallback from './pages/AuthCallback';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import NewsPage from './pages/NewsPage';
import SupportPage from './pages/SupportPage';
import SearchPage from './pages/SearchPage';
import SoloMatchPage from './pages/SoloMatchPage';
import ScheduleMatchPage from './pages/ScheduleMatchPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                <Route path="/home" element={<HomePage />} />
                <Route path="/solo" element={<SoloMatchPage />} />
                <Route path="/schedule" element={<ScheduleMatchPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/support" element={<SupportPage />} />
            </Routes>
        </Router>
    );
}

export default App;