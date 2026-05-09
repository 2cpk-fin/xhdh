import { Swords } from "lucide-react";

interface StartScreenProps {
    onStart: () => void;
    loading: boolean;
}

export const StartScreen = ({ onStart, loading }: StartScreenProps) => (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg
            bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/10 
            border border-purple-200 dark:border-purple-500/30">
            <Swords className="w-12 h-12 text-purple-600 dark:text-[#e879f9]" />
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-black mb-2 text-zinc-800 dark:text-[var(--text-primary)]">
                Ready to Battle?
            </h2>
            <p className="text-sm font-medium max-w-sm text-zinc-500 dark:text-[var(--text-primary)] opacity-60">
                Two universities will go head-to-head. Pick the one you think deserves the top spot.
            </p>
        </div>
        <button
            onClick={onStart}
            disabled={loading}
            className="flex items-center gap-2.5 py-3.5 px-8 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95
            bg-purple-600 hover:bg-purple-700 text-white 
            disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600"
        >
            <Swords className="w-4 h-4" />
            {loading ? "Finding Opponents…" : "Find Opponents"}
        </button>
    </div>
);