import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import NavItem from './NavItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const ControlNavBar = () => {
    const [isHidden, setIsHidden] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsHidden(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <TooltipProvider>
            <header
                className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-4
                    bg-[var(--bg-side)] border-b border-[var(--border-color)] backdrop-blur-xl
                    transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
            >
                {/* Logo & Brand */}
                <div className="flex items-center justify-center shrink-0 group mr-2 gap-2 text-[var(--text-primary)]">
                    <Lucide.ShieldAlert
                        size={20}
                        className="transition-transform duration-300 group-hover:scale-110 
                            text-purple-600 dark:text-[#d946ef] dark:drop-shadow-[0_0_8px_rgba(192,38,211,0.55)]"
                    />
                    <span className="text-sm font-bold tracking-tight hidden sm:block whitespace-nowrap">
                        Control Room
                    </span>
                </div>

                <Separator orientation="vertical" className="h-5 opacity-30" />

                {/* Nav items */}
                <nav className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
                    <NavItem to="/control-room" icon={<Lucide.LayoutDashboard size={16} />} label="Dashboard" end />
                    <NavItem to="/control-room/matches" icon={<Lucide.CalendarDays size={16} />} label="Matches" />
                    <NavItem to="/control-room/universities" icon={<Lucide.GraduationCap size={16} />} label="Universities" />
                    <NavItem to="/control-room/users" icon={<Lucide.Users size={16} />} label="Users" />
                    <NavItem to="/control-room/support" icon={<Lucide.LifeBuoy size={16} />} label="Support" />
                </nav>

                <Separator orientation="vertical" className="h-5 opacity-30 mx-1" />

                {/* Right side actions - Back to App */}
                <div className="flex items-center shrink-0">
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/home')}
                                className="h-9 px-3 rounded-xl gap-2 bg-purple-600/10 text-purple-600 
                                hover:bg-purple-600 hover:text-white dark:bg-purple-500/20 dark:text-[#e879f9] 
                                dark:hover:bg-purple-600 dark:hover:text-white transition-all"
                            >
                                <Lucide.ArrowLeft size={16} />
                                <span className="hidden sm:inline-block font-bold">Back to App</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="font-semibold">
                            Return to Main App
                        </TooltipContent>
                    </Tooltip>
                </div>
            </header>
        </TooltipProvider>
    );
};

export default ControlNavBar;