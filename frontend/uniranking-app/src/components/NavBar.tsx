import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NavItem from './NavItem';
import authApi from '../api/authApi';
import {
    Home, Search, Newspaper, UserCircle, LogOut,
    ShieldAlert, Sun, Moon, Trophy, Gamepad2
} from 'lucide-react';
import { isAdmin } from '../utils/jwt-decode';
import { useDarkMode } from '../hooks/useDarkMode';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const NavBar = () => {
    const [adminStatus, setAdminStatus] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const navigate = useNavigate();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAdminStatus(isAdmin());
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsHidden(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
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
        <TooltipProvider>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-4",
                    "bg-[var(--bg-side)] border-b border-[var(--border-color)] backdrop-blur-xl",
                    "transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isHidden ? "-translate-y-full" : "translate-y-0"
                )}
            >
                <Link to="/home" className="flex items-center justify-center w-8 h-8 shrink-0 group mr-2">
                    <Trophy
                        size={20}
                        className="transition-transform duration-300 group-hover:scale-110
                            text-[#eab308] dark:text-[#facc15]
                            dark:drop-shadow-[0_0_8px_rgba(250,204,21,0.55)]"
                    />
                </Link>

                <Separator orientation="vertical" className="h-5 opacity-30" />

                <nav className="flex items-center gap-1 flex-1">
                    <NavItem to="/home" icon={<Home size={16} />} label="Home" end />
                    <NavItem to="/search" icon={<Search size={16} />} label="Search" />
                    <NavItem to="/news" icon={<Newspaper size={16} />} label="News" />
                    {adminStatus && (
                        <NavItem to="/control-room" icon={<ShieldAlert size={16} />} label="Admin" />
                    )}
                    <NavItem to="/playground" icon={<Gamepad2 size={16} />} label="Playground" />
                    <NavItem to="/profile" icon={<UserCircle size={16} />} label="Profile" />
                </nav>

                <div className="flex items-center gap-1 shrink-0">
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleDarkMode}
                                className={cn(
                                    'w-9 h-9 rounded-xl',
                                    'text-[var(--text-primary)]/60 hover:text-[var(--text-primary)]',
                                    'hover:bg-[var(--text-primary)]/5'
                                )}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={isDarkMode ? 'sun' : 'moon'}
                                        initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
                                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                        exit={{ rotate: 30, opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                                    </motion.span>
                                </AnimatePresence>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="font-semibold">
                            {isDarkMode ? 'Light mode' : 'Dark mode'}
                        </TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="h-5 opacity-30 mx-1" />

                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="w-9 h-9 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10"
                            >
                                <LogOut size={16} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="font-semibold text-red-500">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </div>
            </header>
        </TooltipProvider>
    );
};

export default NavBar;