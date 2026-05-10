import type { UniversityResponse } from "../../../types/university";

type Props = {
    uni: UniversityResponse;
};

export default function ParticipantBox({ uni }: Props) {
    return (
        <div className="flex items-center justify-between p-3 mb-2 rounded-xl transition-all group border
                        bg-[var(--bg-side)] border-[var(--border-color)] hover:border-green-500/50 hover:-translate-y-0.5 hover:shadow-md">
            <div className="min-w-0 flex-1 pr-4">
                <div className="font-bold text-sm text-[var(--text-primary)] truncate group-hover:text-green-500 transition-colors">
                    {uni.name}
                </div>
                <div className="text-xs text-[var(--text-primary)] opacity-40 font-medium mt-0.5 group-hover:opacity-60 transition-colors">
                    {uni.abbreviation} • ELO: {uni.elo}
                </div>
            </div>
            <div className="flex items-center shrink-0 px-3 py-1.5 rounded-lg border transition-colors 
                            bg-green-500/5 border-green-500/20 group-hover:bg-green-500/10">
                <span className="text-xs text-green-500 font-bold mr-1">ID:</span>
                <span className="text-sm font-black text-green-500 font-mono">{uni.id}</span>
            </div>
        </div>
    );
}