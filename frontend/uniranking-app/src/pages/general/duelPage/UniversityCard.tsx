import { useState } from "react";
import { Zap } from "lucide-react";
import type { SoloMatchResponse } from "../../../types/soloMatch";

interface UniversityCardProps {
    university: SoloMatchResponse["university1"];
    onPick: () => void;
    disabled: boolean;
    side: "left" | "right";
}

export const UniversityCard = ({ university, onPick, disabled, side }: UniversityCardProps) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`
                relative flex-1 flex flex-col items-center gap-4 p-8 rounded-2xl border-2 cursor-pointer
                bg-white/60 backdrop-blur-sm transition-all duration-300
                ${hovered ? "border-purple-400 shadow-xl shadow-purple-100 -translate-y-1 bg-white/80" : "border-zinc-200 shadow-md"}
            `}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${hovered ? "opacity-100" : "opacity-0"}`}
                style={{
                    background: side === "left"
                        ? "radial-gradient(circle at 30% 50%, rgba(147,51,234,0.06) 0%, transparent 70%)"
                        : "radial-gradient(circle at 70% 50%, rgba(147,51,234,0.06) 0%, transparent 70%)",
                }}
            />

            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 flex items-center justify-center shadow-inner">
                <span className="text-2xl font-black text-purple-700 tracking-tight">
                    {university.abbreviation}
                </span>
            </div>

            <div className="text-center">
                <h3 className="text-base font-black text-zinc-800 leading-snug mb-1">
                    {university.name}
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-zinc-400">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-zinc-600">{university.elo}</span>
                    <span>Elo</span>
                </div>
            </div>

            <button
                onClick={onPick}
                disabled={disabled}
                className={`
                    w-full py-3 px-6 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200
                    ${disabled ? "bg-zinc-100 text-zinc-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-purple-200 active:scale-95"}
                `}
            >
                {disabled ? "Submitting…" : "Pick Winner"}
            </button>
        </div>
    );
};