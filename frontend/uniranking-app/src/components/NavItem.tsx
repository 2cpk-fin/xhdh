import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    iconOnly?: boolean;
    end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, iconOnly, end }) => {
    const link = (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                cn(
                    'group relative flex items-center gap-2 h-9 px-3 rounded-xl transition-colors duration-200 overflow-hidden',
                    isActive
                        ? 'bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 text-[var(--accent-purple)]'
                        : 'text-[var(--text-primary)]/60 hover:bg-[var(--text-primary)]/5 hover:text-[var(--text-primary)]'
                )
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <motion.span
                            layoutId="nav-active-pill"
                            className="absolute inset-0 rounded-xl bg-[var(--accent-purple)]/10"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                    )}

                    <span className="relative flex items-center justify-center shrink-0 z-10">
                        {icon}
                    </span>

                    {!iconOnly && (
                        <span className="relative text-sm font-bold tracking-wide whitespace-nowrap z-10">
                            {label}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );

    if (iconOnly) {
        return (
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="bottom" className="font-semibold">
                    {label}
                </TooltipContent>
            </Tooltip>
        );
    }

    return link;
};

export default NavItem;