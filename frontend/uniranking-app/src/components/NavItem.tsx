import { NavLink } from 'react-router-dom';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    isCollapsed?: boolean;
    end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isCollapsed, end }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) => `group flex items-center h-12 px-4 rounded-2xl transition-all duration-300 ease-in-out ${isActive
            ? 'bg-purple-50 border border-purple-100 text-purple-600 shadow-sm'
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 border border-transparent'
            }`}
    >
        {({ isActive }) => (
            <>
                <span className={`flex items-center justify-center shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-purple-600' : 'group-hover:scale-110 group-hover:text-zinc-900'}`}>
                    {icon}
                </span>
                <div className={`flex items-center ml-4 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                    <span className={`text-sm font-bold tracking-wide ${isActive ? 'text-purple-700' : ''}`}>
                        {label}
                    </span>
                    {isActive && (
                        <div className="ml-3 w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                    )}
                </div>
            </>
        )}
    </NavLink>
);

export default NavItem;