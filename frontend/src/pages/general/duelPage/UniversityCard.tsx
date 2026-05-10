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
                bg-[var(--bg-side)] transition-all duration-300
                ${hovered ? "border-[var(--accent-purple)] shadow-xl shadow-[var(--accent-purple)]/10 -translate-y-1" : "border-[var(--border-color)]"}
            `}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={!disabled ? onPick : undefined}
        >
            <div
                className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${hovered ? "opacity-100" : "opacity-0"}`}
                style={{
                    background: side === "left"
                        ? "radial-gradient(circle at 30% 50%, rgba(192, 38, 211, 0.06) 0%, transparent 70%)"
                        : "radial-gradient(circle at 70% 50%, rgba(192, 38, 211, 0.06) 0%, transparent 70%)",
                }}
            />

            <div className="w-20 h-20 rounded-2xl bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/20 flex items-center justify-center">
                <span className="text-2xl font-black text-[var(--accent-purple)] tracking-tight">
                    {university.abbreviation}
                </span>
            </div>

            <div className="text-center">
                <h3 className="text-base font-black text-[var(--text-primary)] leading-snug mb-1">
                    {university.name}
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold opacity-40">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[var(--text-primary)] opacity-80">{university.elo}</span>
                    <span>Elo</span>
                </div>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onPick(); }}
                disabled={disabled}
                className={`
                    w-full py-3 px-6 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200
                    ${disabled ? "bg-[var(--border-color)] text-[var(--text-primary)] opacity-20 cursor-not-allowed" : "bg-[var(--accent-purple)] hover:opacity-90 text-white active:scale-95"}
                `}
            >
                {disabled ? "Submitting…" : "Pick Winner"}
            </button>
        </div>
    );
};