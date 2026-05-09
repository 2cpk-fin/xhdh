import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBoxProps {
    title?: string;
    errors: string[];
    duration?: number;
    onClose: () => void;
    position?: 'left' | 'right';
}

const ErrorBox: React.FC<ErrorBoxProps> = ({
    title = 'Error',
    errors,
    duration = 5000,
    onClose,
    position = 'right',
}) => {
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [errors, duration, onClose]);

    if (errors.length === 0) return null;

    const positionClass = position === 'left' ? 'left-6' : 'right-6';

    return (
        <div
            className={`fixed bottom-6 z-50 max-w-sm w-full rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 ${positionClass}
            bg-[var(--bg-side)] border border-red-200 dark:border-red-900/30 
            shadow-2xl dark:shadow-[0_0_32px_rgba(239,68,68,0.12)] transition-colors duration-300`}
        >
            <div className="p-5">
                <div className="flex items-center gap-2 text-sm font-bold mb-3 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{title}</span>
                </div>

                <ul className="space-y-2 pl-1">
                    {errors.map((err, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-[var(--text-primary)] opacity-80">
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-red-500" />
                            {err}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Progress Bar */}
            <div className="h-0.5 w-full bg-red-100 dark:bg-red-950/30">
                <div
                    className="h-full origin-left bg-red-500 dark:bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    style={{ animation: `shrinkBar ${duration}ms linear forwards` }}
                />
            </div>

            <style>{`
                @keyframes shrinkBar {
                    from { transform: scaleX(1); }
                    to   { transform: scaleX(0); }
                }
            `}</style>
        </div>
    );
};

export default ErrorBox;