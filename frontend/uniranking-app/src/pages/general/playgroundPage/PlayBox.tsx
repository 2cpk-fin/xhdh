// PlayBox.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PlayBoxProps {
    title: string;
    description: string;
    to: string;
    icon: React.ReactNode;
    accent: string;
    badge?: string;
    disabled?: boolean;
}

const MotionLink = motion(Link);

const PlayBox = ({ title, description, to, icon, accent, badge, disabled }: PlayBoxProps) => {
    return (
        <MotionLink
            to={disabled ? '#' : to}
            onClick={disabled ? (e) => e.preventDefault() : undefined}
            whileHover={disabled ? {} : { y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={cn(
                'group relative flex flex-col p-6 rounded-3xl overflow-hidden',
                'bg-[var(--bg-side)] border border-[var(--border-color)] shadow-sm backdrop-blur-xl',
                'min-h-[220px]',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            )}
        >
            <div
                className="absolute -right-20 -top-20 w-64 h-64 pointer-events-none opacity-20 blur-[80px] transition-opacity duration-500 group-hover:opacity-40"
                style={{ background: accent }}
            />

            <div className="flex items-start justify-between mb-6 z-10">
                <div
                    className="flex items-center justify-center w-14 h-14 rounded-2xl border transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                        background: `${accent}15`,
                        borderColor: `${accent}30`,
                        color: accent,
                    }}
                >
                    {icon}
                </div>
                {badge && (
                    <Badge
                        variant="outline"
                        className="text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-full"
                        style={{ color: accent, borderColor: `${accent}50`, background: `${accent}10` }}
                    >
                        {badge}
                    </Badge>
                )}
            </div>

            <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)] mb-2">
                    {title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-[var(--text-primary)] opacity-60 line-clamp-2 mb-5">
                    {description}
                </p>
                <div
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest
                    transition-all duration-300 group-hover:gap-2.5"
                    style={{ color: accent }}
                >
                    <span>Launch Protocol</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </MotionLink>
    );
};

export default PlayBox;