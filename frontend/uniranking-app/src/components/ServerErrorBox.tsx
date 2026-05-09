import { X, AlertCircle } from 'lucide-react';

export default function ServerErrorBox({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/25 dark:bg-black/60">
            <div className="relative w-full max-w-sm rounded-3xl p-6 animate-in fade-in zoom-in-95 duration-200
                bg-[var(--bg-side)]
                border border-red-200 dark:border-red-900/30
                shadow-xl dark:shadow-[0_0_40px_rgba(239,68,68,0.1)]">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-red-500/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                        <AlertCircle className="w-7 h-7 text-red-500 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-black mb-2 text-[var(--text-primary)] dark:text-red-300">Server Error</h3>
                    <p className="text-sm font-medium text-[var(--text-primary)] opacity-60">{message}</p>
                    <button
                        onClick={onClose}
                        className="mt-6 w-full py-2.5 rounded-2xl text-sm font-bold bg-[var(--text-primary)]/5 dark:bg-red-500/10 text-[var(--text-primary)] dark:text-red-400 hover:bg-[var(--text-primary)]/10 dark:hover:bg-red-500/20 transition-all"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}