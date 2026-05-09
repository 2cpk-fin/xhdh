import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import NavItem from './NavItem';

const ControlNavBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    // State to track if the bar is completely hidden off-screen
    const [isHidden, setIsHidden] = useState(false);
    const navigate = useNavigate();

    // Listen for Escape key to bring the bar back
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsHidden(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <aside
            className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'} 
            flex flex-col z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
            bg-[var(--bg-side)] border-r border-[var(--border-color)] backdrop-blur-xl will-change-[transform,width]
            ${isHidden ? '-translate-x-full' : 'translate-x-0'}`}
        >
            {/* Header Section */}
            <div className="px-3 h-16 flex items-center shrink-0 border-b border-[var(--border-color)] opacity-80 relative overflow-hidden">
                <div className="flex items-center gap-2 z-10">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center justify-center shrink-0 w-9 h-9 rounded-xl transition-all duration-200 active:scale-95
                        bg-transparent dark:bg-[rgba(192,38,211,0.08)]
                        text-[var(--text-primary)] dark:text-[#e879f9]"
                    >
                        {isCollapsed ? <Lucide.PanelLeftOpen size={18} /> : <Lucide.PanelLeftClose size={18} />}
                    </button>

                    {/* HIDDEN BUTTON: Only shows when not collapsed to keep UI clean */}
                    {!isCollapsed && (
                        <button
                            onClick={() => setIsHidden(true)}
                            className="flex items-center justify-center shrink-0 w-9 h-9 rounded-xl transition-all duration-200 active:scale-95
                            hover:bg-red-500/10 text-gray-500 hover:text-red-500"
                            title="Hide Sidebar (Press ESC to show)"
                        >
                            <Lucide.X size={18} />
                        </button>
                    )}
                </div>

                <div className={`absolute left-24 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isCollapsed ? 'opacity-0 -translate-x-2 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
                    <span className="text-sm font-bold tracking-tight text-[var(--text-primary)] dark:shadow-[0_0_16px_rgba(192,38,211,0.45)] whitespace-nowrap">
                        Control Room
                    </span>
                </div>
            </div>

            {/* Navigation Section */}
            <div className="px-3 flex-1 overflow-y-auto no-scrollbar py-3 overflow-x-hidden relative">
                <div className={`h-6 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isCollapsed ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}>
                    <p className="px-3 mb-2 text-[9px] font-bold tracking-[0.12em] uppercase text-[#a1a1aa] dark:text-[#3f3f46] whitespace-nowrap">
                        Admin
                    </p>
                </div>

                <nav className="space-y-1">
                    <NavItem to="/control-room" icon={<Lucide.LayoutDashboard size={18} />} label="Dashboard" end={true} isCollapsed={isCollapsed} />
                    <NavItem to="/control-room/matches" icon={<Lucide.CalendarDays size={18} />} label="Matches" isCollapsed={isCollapsed} />
                    <NavItem to="/control-room/universities" icon={<Lucide.GraduationCap size={18} />} label="Universities" isCollapsed={isCollapsed} />
                    <NavItem to="/control-room/users" icon={<Lucide.Users size={18} />} label="Users" isCollapsed={isCollapsed} />
                </nav>
            </div>

            {/* Bottom Section - Purple Button */}
            <div className="p-3 shrink-0 border-t border-[var(--border-color)] opacity-80 overflow-hidden">
                <button
                    onClick={() => navigate('/home')}
                    className="group relative flex items-center h-11 w-full rounded-xl transition-all duration-300 active:scale-95
                    bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500
                    text-white shadow-lg shadow-purple-500/20"
                >
                    <div className="flex items-center justify-center shrink-0 w-11 h-11 z-10">
                        <Lucide.ArrowLeft size={17} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>

                    <div className={`absolute left-11 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                        ${isCollapsed ? 'opacity-0 -translate-x-2 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
                        <span className="text-sm font-bold whitespace-nowrap">Back to App</span>
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default ControlNavBar;