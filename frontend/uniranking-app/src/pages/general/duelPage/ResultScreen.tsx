import { Trophy, TrendingUp, TrendingDown, RefreshCw, LogOut } from "lucide-react";
import type { SoloMatchReport } from "../../../types/soloMatch";

interface ResultScreenProps {
    report: SoloMatchReport;
    onNextMatch: () => void;
    onStop: () => void;
}

export const ResultScreen = ({ report, onNextMatch, onStop }: ResultScreenProps) => (
    <div className="flex flex-col items-center gap-8 py-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-50 border border-amber-200 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-amber-500" />
        </div>

        <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-purple-500 mb-1">Match Complete</p>
            <h2 className="text-2xl font-black text-zinc-800">Results Are In</h2>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Winner */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 flex flex-col gap-3">
                <div className="absolute top-3 right-3">
                    <span className="text-xs font-black uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-1 rounded-full">Winner</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center">
                    <span className="text-sm font-black text-emerald-700">{report.winner.abbreviation}</span>
                </div>
                <div>
                    <p className="font-black text-zinc-800 text-base">{report.winner.name}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-auto">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-black text-lg">+{report.winnerEloChange}</span>
                    <span className="text-zinc-400 text-sm font-bold">Elo</span>
                </div>
            </div>

            {/* Loser */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-6 flex flex-col gap-3">
                <div className="absolute top-3 right-3">
                    <span className="text-xs font-black uppercase tracking-wider bg-zinc-400 text-white px-2.5 py-1 rounded-full">Defeated</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center">
                    <span className="text-sm font-black text-zinc-500">{report.loser.abbreviation}</span>
                </div>
                <div>
                    <p className="font-black text-zinc-600 text-base">{report.loser.name}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-auto">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span className="text-red-500 font-black text-lg">-{report.loserEloChange}</span>
                    <span className="text-zinc-400 text-sm font-bold">Elo</span>
                </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
                onClick={onStop}
                className="flex items-center justify-center gap-2.5 py-3 px-7 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-95"
            >
                <LogOut className="w-4 h-4" />
                Stop Playing
            </button>
            <button
                onClick={onNextMatch}
                className="flex items-center justify-center gap-2.5 py-3 px-7 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-purple-200 active:scale-95"
            >
                <RefreshCw className="w-4 h-4" />
                Next Match
            </button>
        </div>
    </div>
);