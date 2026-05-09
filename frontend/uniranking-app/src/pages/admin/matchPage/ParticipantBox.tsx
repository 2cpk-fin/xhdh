import type { UniversityResponse } from "../../../types/university";

type Props = {
    uni: UniversityResponse;
};

export default function ParticipantBox({ uni }: Props) {
    return (
        <div className="flex items-center justify-between p-3 mb-2 bg-white border border-zinc-200 rounded-xl hover:border-green-400 transition-all hover:-translate-y-0.5 hover:shadow-md group">
            <div className="min-w-0 flex-1 pr-4">
                <div className="font-bold text-sm text-zinc-800 truncate group-hover:text-green-700 transition-colors">{uni.name}</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5 group-hover:text-zinc-600 transition-colors">
                    {uni.abbreviation} • ELO: {uni.elo}
                </div>
            </div>
            <div className="flex items-center shrink-0 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 transition-colors group-hover:bg-green-100">
                <span className="text-xs text-green-600 font-bold mr-1">ID:</span>
                <span className="text-sm font-black text-green-800 font-mono">{uni.id}</span>
            </div>
        </div>
    );
}