import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBoxProps {
    title?: string;
    errors: string[];
    duration?: number;
    onClose: () => void;
    position?: 'left' | 'right';
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ title = "Error", errors, duration = 5000, onClose, position = 'right' }) => {
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [errors, duration, onClose]);

    if (errors.length === 0) return null;

    const positionClasses = position === 'left'
        ? 'left-6 slide-in-from-left-8'
        : 'right-6 slide-in-from-right-8';

    return (
        <div className={`fixed bottom-6 z-50 bg-white border border-red-200 rounded-xl overflow-hidden max-w-sm w-full animate-in fade-in slide-in-from-bottom-8 transition-all ${positionClasses}`}>
            <div className="p-5">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-3">
                    <AlertCircle className="w-5 h-5" />
                    <span>{title}</span>
                </div>
                <ul className="space-y-2 pl-1">
                    {errors.map((err, idx) => (
                        <li key={idx} className="text-xs font-semibold text-zinc-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            {err}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Time running out progress bar */}
            <div className="h-1 bg-zinc-100 w-full">
                <div
                    className="h-full bg-red-500 origin-left"
                    style={{ animation: `shrinkBar ${duration}ms linear forwards` }}
                />
            </div>
            <style>{`
                @keyframes shrinkBar {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
            `}</style>
        </div>
    );
};

export default ErrorBox;