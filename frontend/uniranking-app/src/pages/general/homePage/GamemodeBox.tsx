// GamemodeBox.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface GamemodeBoxProps {
    title: string;
    description: string;
    to: string;
    icon: React.ReactNode;
    accent: string;
    badge?: string;
    disabled?: boolean;
}

const MotionLink = motion(Link);

const GamemodeBox = ({ title, description, to, icon, accent, badge, disabled }: GamemodeBoxProps) => {
    return (
        <MotionLink
            to={disabled ? '#' : to}
            onClick={disabled ? (e) => e.preventDefault() : undefined}
            whileHover={disabled ? {} : { y: -3 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className={cn(
                'group relative flex items-center gap-6 p-6 rounded-2xl overflow-hidden',
                'border bg-[var(--bg-side)] border-[var(--border-color)] backdrop-blur-md',
                'min-h-[160px]',
                disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            )}
        >
            {!disabled && (
                <div
                    className="absolute inset-y-0 w-1/2 pointer-events-none
                    -translate-x-full group-hover:translate-x-[300%] transition-transform duration-500 ease-in-out"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
                />
            )}

            <div
                className="absolute left-0 top-0 w-48 h-48 pointer-events-none opacity-20 blur-[60px]"
                style={{ background: accent }}
            />

            <motion.div
                whileHover={disabled ? {} : { scale: 1.08, rotate: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="relative shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border z-10"
                style={{
                    background: `${accent}18`,
                    borderColor: `${accent}45`,
                    color: accent,
                    boxShadow: `0 0 20px ${accent}30`,
                }}
            >
                <span className="w-9 h-9 flex items-center justify-center">
                    {icon}
                </span>
            </motion.div>

            <div className="flex-1 relative z-10 min-w-0">
                <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] mb-1">
                    {title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-[var(--text-primary)] opacity-60 line-clamp-2">
                    {description}
                </p>
                <div
                    className="flex items-center gap-1.5 mt-3 text-[11px] font-black uppercase tracking-widest
                    transition-all duration-300 group-hover:gap-2.5"
                    style={{ color: accent }}
                >
                    <span>Enter {title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </div>

            {(badge || disabled) && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                    {!disabled && badge && (
                        <span className="relative flex h-2 w-2">
                            <span
                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                style={{ background: accent }}
                            />
                            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: accent }} />
                        </span>
                    )}
                    <Badge
                        variant="outline"
                        className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-full"
                        style={
                            disabled
                                ? { color: '#71717a', borderColor: '#3f3f46', background: 'transparent' }
                                : { color: accent, borderColor: `${accent}50`, background: `${accent}12` }
                        }
                    >
                        {disabled ? 'Coming Soon' : badge}
                    </Badge>
                </div>
            )}

            {disabled && (
                <div className="absolute inset-0 rounded-2xl bg-[var(--bg-main)] opacity-20 pointer-events-none" />
            )}
        </MotionLink>
    );
};

export default GamemodeBox;