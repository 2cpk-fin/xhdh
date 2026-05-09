import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import NavItem from './NavItem';

const ControlNavBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <aside
            className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'} 
            flex flex-col z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            bg-[var(--bg-side)] border-r border-[var(--border-color)] backdrop-blur-xl`}
        >
            <div className="px-3 h-16 flex items-center gap-3 shrink-0 overflow-hidden border-b border-[var(--border-color)] opacity-80">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center justify-center shrink-0 w-9 h-9 rounded-xl transition-all duration-200 active:scale-95
                    bg-transparent dark:bg-[rgba(192,38,211,0.08)]
                    text-[var(--text-primary)] dark:text-[#e879f9]"
                >
                    {isCollapsed ? <Lucide.PanelLeftOpen size={18} /> : <Lucide.PanelLeftClose size={18} />}
                </button>

                <div className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
                    <span className="text-sm font-bold tracking-tight text-[var(--text-primary)] dark:shadow-[0_0_16px_rgba(192,38,211,0.45)]">
                        Control Room
                    </span>
                </div>
            </div>

            <div className="px-3 flex-1 overflow-y-auto no-scrollbar py-3">
                {!isCollapsed && (
                    <p className="px-3 mb-2 text-[9px] font-bold tracking-[0.12em] uppercase text-[#a1a1aa] dark:text-[#3f3f46]">
                        Admin
                    </p>
                )}
                <nav className="space-y-1">
                    <NavItem to="/control-room" icon={<Lucide.LayoutDashboard size={18} />} label="Dashboard" end={true} isCollapsed={isCollapsed} />
                    <NavItem to="/control-room/matches" icon={<Lucide.CalendarDays size={18} />} label="Matches" isCollapsed={isCollapsed} />
                    <NavItem to="/control-room/universities" icon={<Lucide.GraduationCap size={18} />} label="Universities" isCollapsed={isCollapsed} />
                    <NavItem to="/control-room/users" icon={<Lucide.Users size={18} />} label="Users" isCollapsed={isCollapsed} />
                </nav>
            </div>

            <div className="p-3 shrink-0 border-t border-[var(--border-color)] opacity-80">
                <button
                    onClick={() => navigate('/home')}
                    className="group flex items-center h-11 w-full rounded-2xl transition-all duration-200 active:scale-95 overflow-hidden
                    bg-white dark:bg-[rgba(192,38,211,0.06)] 
                    border border-[#e4e4e7] dark:border-[rgba(192,38,211,0.3)]
                    text-[#71717a] dark:text-[#d946ef]"
                >
                    <div className="flex items-center justify-center shrink-0 w-11 h-11">
                        <Lucide.ArrowLeft size={17} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    {!isCollapsed && <span className="text-sm font-bold ml-1">Back to App</span>}
                </button>
            </div>
        </aside>
    );
};

export default ControlNavBar;