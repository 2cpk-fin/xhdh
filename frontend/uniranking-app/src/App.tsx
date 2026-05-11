import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AuthCallback from './pages/AuthCallback';
import HomePage from './pages/general/homePage/HomePage';
import ProfilePage from './pages/general/profilePage/ProfilePage';
import NewsPage from './pages/general/newsPage/NewsPage';
import SupportPage from './pages/general/supportPage/SupportPage';
import SearchPage from './pages/general/searchPage/SearchPage';
import SoloMatchPage from './pages/general/duelPage/SoloMatchPage';
import ScheduleMatchPage from './pages/general/eventPage/ScheduleMatchPage';
import AdminRoute from './components/AdminRoute';
import ControlNavBar from './components/ControlNavBar';
import ControlPage from './pages/ControlPage';
import MatchControlPage from './pages/admin/matchPage/MatchControlPage';
import UniversityControlPage from './pages/admin/universityPage/UniversityControlPage';
import UserControlPage from './pages/admin/userPage/UserControlPage';
import MessageFromClientsPage from './pages/admin/feedbackPage/MessageFromClientsPage';
import PlaygroundPage from './pages/general/playgroundPage/PlaygroundPage';
import EnergyCorePage from './pages/general/playgroundPage/EnergyCorePage';
import ElectronPage from './pages/general/playgroundPage/ElectronPage';
import ElectricCircuitPage from './pages/general/playgroundPage/ElectricCircuitPage';
import PaintPage from './pages/general/playgroundPage/PaintPage';

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
                <Route path="/playground" element={<PlaygroundPage />} />
                <Route path="/energy-core" element={<EnergyCorePage />} />
                <Route path="/electron-field" element={<ElectronPage />} />
                <Route path="/electric-circuit" element={<ElectricCircuitPage />} />
                <Route path="/paint-field" element={<PaintPage />} />
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
                        <Route path="support" element={<MessageFromClientsPage />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;