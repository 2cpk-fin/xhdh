import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import authApi from '../api/authApi';
import { Home, Search, Newspaper, UserCircle, LogOut, PanelLeftClose, PanelLeftOpen, ShieldAlert } from 'lucide-react';
import { isAdmin } from '../utils/jwt-decode';

const NavBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [adminStatus, setAdminStatus] = useState(false);
    const navigate = useNavigate();

    // Check admin status on component mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAdminStatus(isAdmin());
    }, []);

    const handleLogout = async () => {
        const accessToken = localStorage.getItem('accessToken') || '';
        const refreshToken = localStorage.getItem('refreshToken') || '';

        try {
            await authApi.logout({ accessToken, refreshToken });
            navigate('/login');
        } catch (error) {
            console.log(error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }
    };

    return (
        <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] ${isCollapsed ? 'w-20' : 'w-64'} bg-white/70 backdrop-blur-xl border-r border-zinc-200 flex flex-col z-40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`}>
            <div className="px-4 h-16 flex items-center shrink-0">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="-ml-2 p-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors duration-200"
                >
                    {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                </button>
            </div>

            <div className="px-4 flex-1 overflow-y-auto no-scrollbar py-2">
                <nav className="space-y-2">
                    <NavItem to="/home" icon={<Home size={20} />} label="Home" isCollapsed={isCollapsed} />
                    <NavItem to="/search" icon={<Search size={20} />} label="Search" isCollapsed={isCollapsed} />
                    <NavItem to="/news" icon={<Newspaper size={20} />} label="News" isCollapsed={isCollapsed} />

                    {/* Conditionally render the Control Room item */}
                    {adminStatus && (
                        <NavItem
                            to="/control-room"
                            icon={<ShieldAlert size={20} />}
                            label="Control Room"
                            isCollapsed={isCollapsed}
                        />
                    )}

                    <NavItem to="/profile" icon={<UserCircle size={20} />} label="Profile" isCollapsed={isCollapsed} />
                </nav>
            </div>

            <div className="p-4 border-t border-zinc-100 shrink-0">
                <button
                    onClick={handleLogout}
                    className={`group flex items-center h-12 w-full rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'px-0 justify-center' : 'px-4'}`}
                >
                    <LogOut size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className={`ml-4 text-sm font-bold tracking-wide transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default NavBar;