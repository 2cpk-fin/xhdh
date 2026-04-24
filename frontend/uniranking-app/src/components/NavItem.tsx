import { NavLink } from 'react-router-dom';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${isActive
            ? 'bg-purple-50 border border-purple-100 text-purple-600 shadow-sm'
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 border border-transparent'
            }`}
    >
        {({ isActive }) => (
            <>
                <span className={`flex items-center justify-center transition-transform ${isActive ? 'scale-110 text-purple-600' : 'group-hover:scale-110 group-hover:text-zinc-900'}`}>
                    {icon}
                </span>
                <span className={`text-sm font-bold tracking-wide ${isActive ? 'text-purple-700' : ''}`}>
                    {label}
                </span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                )}
            </>
        )}
    </NavLink>
);

export default NavItem;