import NavItem from './NavItem';
import { Home, Search, Newspaper, Users, UserCircle } from 'lucide-react';

const NavBar = () => {
    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white/70 backdrop-blur-xl border-r border-zinc-200 flex flex-col z-40 transition-all duration-300">
            <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
                <nav className="space-y-1.5">
                    <NavItem to="/home" icon={<Home size={20} />} label="Home" />
                    <NavItem to="/search" icon={<Search size={20} />} label="Search" />
                    <NavItem to="/news" icon={<Newspaper size={20} />} label="News" />
                    <NavItem to="/community" icon={<Users size={20} />} label="Community" />
                    <NavItem to="/profile" icon={<UserCircle size={20} />} label="Profile" />
                </nav>
            </div>
        </aside>
    );
};

export default NavBar;