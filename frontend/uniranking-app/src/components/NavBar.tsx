import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import authApi from '../api/authApi';
import { Home, Search, Newspaper, UserCircle, LogOut, PanelLeftClose, PanelLeftOpen, ShieldAlert, Sun, Moon } from 'lucide-react';
import { isAdmin } from '../utils/jwt-decode';
import { useDarkMode } from '../hooks/useDarkMode';

const NavBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [adminStatus, setAdminStatus] = useState(false);
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const navigate = useNavigate();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAdminStatus(isAdmin());
    }, []);

    const handleLogout = async () => {
        const accessToken = localStorage.getItem('accessToken') || '';
        const refreshToken = localStorage.getItem('refreshToken') || '';
        try {
            await authApi.logout({ accessToken, refreshToken });
        } catch (error) {
            console.log(error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login', { replace: true });
        }
    };

    return (
        <aside
            className={`fixed left-0 top-16 h-[calc(100vh-64px)] ${isCollapsed ? 'w-20' : 'w-64'} 
            flex flex-col z-40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            bg-[var(--bg-side)] border-r border-[var(--border-color)] backdrop-blur-xl`}
        >
            <div className="px-3 h-16 flex items-center shrink-0 border-b border-[var(--border-color)] opacity-80">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 active:scale-95
                    bg-transparent dark:bg-[rgba(192,38,211,0.08)]
                    text-[var(--text-primary)] dark:text-[var(--accent-purple)]"
                >
                    {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>
            </div>

            <div className="px-3 flex-1 overflow-y-auto no-scrollbar py-3">
                {!isCollapsed && (
                    <p className="px-3 mb-2 text-[9px] font-bold tracking-[0.12em] uppercase text-[#a1a1aa] dark:text-[#3f3f46]">
                        Menu
                    </p>
                )}
                <nav className="space-y-1">
                    <NavItem to="/home" icon={<Home size={18} />} label="Home" isCollapsed={isCollapsed} />
                    <NavItem to="/search" icon={<Search size={18} />} label="Search" isCollapsed={isCollapsed} />
                    <NavItem to="/news" icon={<Newspaper size={18} />} label="News" isCollapsed={isCollapsed} />
                    {adminStatus && (
                        <NavItem to="/control-room" icon={<ShieldAlert size={18} />} label="Control Room" isCollapsed={isCollapsed} />
                    )}
                    <NavItem to="/profile" icon={<UserCircle size={18} />} label="Profile" isCollapsed={isCollapsed} />
                </nav>
            </div>

            <div className="p-3 shrink-0 space-y-1 border-t border-[var(--border-color)] opacity-80">
                <button
                    onClick={toggleDarkMode}
                    className="group flex items-center h-11 w-full rounded-2xl transition-all duration-200 active:scale-95 overflow-hidden
                    text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]"
                >
                    <div className="flex items-center justify-center shrink-0 w-11 h-11">
                        {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
                    </div>
                    {!isCollapsed && <span className="text-sm font-bold ml-1">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>}
                </button>

                <button
                    onClick={handleLogout}
                    className="group flex items-center h-11 w-full rounded-2xl transition-all duration-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                    <div className="flex items-center justify-center shrink-0 w-11 h-11">
                        <LogOut size={17} />
                    </div>
                    {!isCollapsed && <span className="text-sm font-bold ml-1">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default NavBar;