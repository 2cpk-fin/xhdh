import { NavLink } from 'react-router-dom';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    isCollapsed?: boolean;
    end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isCollapsed, end }) => {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `
                group flex items-center h-11 px-3 rounded-2xl transition-all duration-200
                ${isActive
                    ? 'bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 text-[var(--accent-purple)]'
                    : 'text-[var(--text-primary)]/60 hover:bg-[var(--text-primary)]/5'}
            `}
        >
            <span className="flex items-center justify-center shrink-0">
                {icon}
            </span>

            {!isCollapsed && (
                <span className="ml-3 text-sm font-bold tracking-wide">
                    {label}
                </span>
            )}
        </NavLink>
    );
};

export default NavItem;