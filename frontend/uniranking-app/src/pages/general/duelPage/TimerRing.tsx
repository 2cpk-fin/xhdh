import { Clock } from "lucide-react";

interface TimerRingProps {
    timeLeft: number;
    total: number;
}

export const TimerRing = ({ timeLeft, total }: TimerRingProps) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / total;
    const dashOffset = circumference * (1 - progress);

    const color = progress > 0.5 ? "#9333ea" : progress > 0.25 ? "#f59e0b" : "#ef4444";
    const minutes = Math.floor(timeLeft / 60);
    const seconds = (timeLeft % 60).toString().padStart(2, "0");

    return (
        <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r={radius} fill="none" stroke="#e4e4e7" strokeWidth="5" />
                    <circle
                        cx="35"
                        cy="35"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
                    />
                </svg>
                <span className="text-xs font-black text-zinc-700 tabular-nums">
                    {minutes}:{seconds}
                </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-500">
                <Clock className="w-4 h-4" />
                Time Remaining
            </div>
        </div>
    );
};