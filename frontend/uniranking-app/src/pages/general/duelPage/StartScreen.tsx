import { Swords } from "lucide-react";

interface StartScreenProps {
    onStart: () => void;
    loading: boolean;
}

export const StartScreen = ({ onStart, loading }: StartScreenProps) => (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 flex items-center justify-center shadow-lg">
            <Swords className="w-12 h-12 text-purple-600" />
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-black text-zinc-800 mb-2">Ready to Battle?</h2>
            <p className="text-zinc-500 font-medium max-w-sm">
                Two universities will go head-to-head. Pick the one you think deserves the top spot.
            </p>
        </div>
        <button
            onClick={onStart}
            disabled={loading}
            className="flex items-center gap-2.5 py-3.5 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-200 text-white disabled:text-zinc-400 font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-purple-200 active:scale-95"
        >
            <Swords className="w-4 h-4" />
            {loading ? "Finding Opponents…" : "Find Opponents"}
        </button>
    </div>
);