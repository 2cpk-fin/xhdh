import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, CalendarDays, Users } from 'lucide-react';
import NavItem from './NavItem';

const ControlNavBar = () => {
    const navigate = useNavigate();

    return (
        <header className="bg-white/70 backdrop-blur-xl border-b border-zinc-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Left: Navigation Links using your NavItem */}
                    <nav className="flex space-x-2">
                        <NavItem
                            to="/control-room"
                            icon={<LayoutDashboard size={20} />}
                            label="Dashboard"
                            end={true}
                            isCollapsed={false}
                        />
                        <NavItem
                            to="/control-room/matches"
                            icon={<CalendarDays size={20} />}
                            label="Matches"
                            isCollapsed={false}
                        />
                        <NavItem
                            to="/control-room/users"
                            icon={<Users size={20} />}
                            label="Users"
                            isCollapsed={false}
                        />
                    </nav>

                    {/* Right: Exit to Main App */}
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center h-10 px-4 text-sm font-bold text-zinc-500 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back to App
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ControlNavBar;