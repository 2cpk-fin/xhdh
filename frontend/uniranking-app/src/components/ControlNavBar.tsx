import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    LayoutDashboard,
    CalendarDays,
    Users,
    GraduationCap,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import NavItem from './NavItem';

const ControlNavBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <aside
            className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'
                } bg-white/70 backdrop-blur-xl border-r border-zinc-200 flex flex-col z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`}
        >
            {/* Collapse Toggle Section */}
            <div className="px-4 h-16 flex items-center shrink-0">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="-ml-2 p-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors duration-200"
                >
                    {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                </button>
                {!isCollapsed && (
                    <span className="ml-2 font-bold text-zinc-900 truncate">Control Room</span>
                )}
            </div>

            {/* Navigation Links */}
            <div className="px-4 flex-1 overflow-y-auto no-scrollbar py-2">
                <nav className="space-y-2">
                    <NavItem
                        to="/control-room"
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        end={true}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        to="/control-room/matches"
                        icon={<CalendarDays size={20} />}
                        label="Matches"
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        to="/control-room/universities"
                        icon={<GraduationCap size={20} />}
                        label="Universities"
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        to="/control-room/users"
                        icon={<Users size={20} />}
                        label="Users"
                        isCollapsed={isCollapsed}
                    />
                </nav>
            </div>

            {/* Bottom Section: Back to App */}
            <div className="p-4 border-t border-zinc-100 shrink-0">
                <button
                    onClick={() => navigate('/home')}
                    className={`group flex items-center h-12 w-full rounded-2xl text-zinc-500 bg-white border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-300 shadow-sm ${isCollapsed ? 'px-0 justify-center' : 'px-4'
                        }`}
                >
                    <ArrowLeft
                        size={20}
                        className="shrink-0 group-hover:-translate-x-1 transition-transform duration-300"
                    />
                    <span
                        className={`ml-4 text-sm font-bold tracking-wide transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'
                            }`}
                    >
                        Back to App
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default ControlNavBar;