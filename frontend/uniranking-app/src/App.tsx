import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import AdminRoute from './components/AdminRoute';

import ControlNavBar from './components/ControlNavBar';
import ControlPage from './pages/ControlPage';
import MatchControlPage from './pages/admin/MatchControlPage';
import UniversityControlPage from './pages/admin/UniversityControlPage';
import UserControlPage from './pages/admin/UserControlPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />

                {/* --- Public / User Routes --- */}
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

                {/* --- Protected Admin Routes --- */}
                <Route element={<AdminRoute />}>

                    <Route
                        path="/control-room"
                        element={
                            <div className="min-h-screen bg-zinc-50/50">
                                <ControlNavBar />
                                <Outlet />
                            </div>
                        }
                    >
                        <Route index element={<ControlPage />} />
                        <Route path="matches" element={<MatchControlPage />} />
                        <Route path="universities" element={<UniversityControlPage />} />
                        <Route path="users" element={<UserControlPage />} />
                        {/* <Route path="users" element={<UserControlPage />} /> */}
                    </Route>

                </Route>
            </Routes>
        </Router>
    );
}

export default App;