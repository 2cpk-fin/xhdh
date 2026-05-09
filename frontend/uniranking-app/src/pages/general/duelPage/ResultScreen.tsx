import { Trophy, TrendingUp, TrendingDown, RefreshCw, LogOut } from "lucide-react";
import type { SoloMatchReport } from "../../../types/soloMatch";

interface ResultScreenProps {
    report: SoloMatchReport;
    onNextMatch: () => void;
    onStop: () => void;
}

export const ResultScreen = ({ report, onNextMatch, onStop }: ResultScreenProps) => (
    <div className="flex flex-col items-center gap-8 py-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-amber-500" />
        </div>

        <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--accent-purple)] mb-1">Match Complete</p>
            <h2 className="text-2xl font-black text-[var(--text-primary)]">Results Are In</h2>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 flex flex-col gap-3">
                <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">Winner</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] border border-emerald-500/20 flex items-center justify-center">
                    <span className="text-sm font-black text-emerald-500">{report.winner.abbreviation}</span>
                </div>
                <p className="font-black text-[var(--text-primary)] text-base">{report.winner.name}</p>
                <div className="flex items-center gap-1.5 mt-auto text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-black text-lg">+{report.winnerEloChange} Elo</span>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-red-500/30 bg-red-500/5 p-6 flex flex-col gap-3">
                <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-red-500 text-white px-2 py-0.5 rounded-full">Defeated</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] border border-red-500/20 flex items-center justify-center">
                    <span className="text-sm font-black text-red-500">{report.loser.abbreviation}</span>
                </div>
                <p className="font-black text-[var(--text-primary)] opacity-60 text-base">{report.loser.name}</p>
                <div className="flex items-center gap-1.5 mt-auto text-red-500">
                    <TrendingDown className="w-4 h-4" />
                    <span className="font-black text-lg">-{report.loserEloChange} Elo</span>
                </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
                onClick={onStop}
                className="flex items-center justify-center gap-2.5 py-3 px-7 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] opacity-60 hover:opacity-100 hover:bg-[var(--text-primary)]/5 font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95"
            >
                <LogOut className="w-4 h-4" />
                Stop Playing
            </button>
            <button
                onClick={onNextMatch}
                className="flex items-center justify-center gap-2.5 py-3 px-7 rounded-xl bg-[var(--accent-purple)] text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:opacity-90 active:scale-95"
            >
                <RefreshCw className="w-4 h-4" />
                Next Match
            </button>
        </div>
    </div>
);