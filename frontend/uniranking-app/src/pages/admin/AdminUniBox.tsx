import type { UniversityResponse } from "../../types/university";

type Props = {
    uni: UniversityResponse;
};

export default function AdminUniItem({ uni }: Props) {
    return (
        <div className="flex items-center justify-between p-3 mb-2 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-purple-300 transition-colors">
            <div className="min-w-0 flex-1 pr-4">
                <div className="font-bold text-sm text-zinc-800 truncate">{uni.name}</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">
                    {uni.abbreviation} • ELO: {uni.elo}
                </div>
            </div>
            <div className="flex items-center shrink-0 bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200">
                <span className="text-xs text-purple-700 font-bold mr-1">ID:</span>
                <span className="text-sm font-black text-purple-900 font-mono">{uni.id}</span>
            </div>
        </div>
    );
}