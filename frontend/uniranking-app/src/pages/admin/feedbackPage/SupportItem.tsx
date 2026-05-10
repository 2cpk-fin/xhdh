import { MessageSquare, Clock } from 'lucide-react';
import type { SupportResponse } from '../../../types/support';

type Props = {
    support: SupportResponse;
};

const SupportItem = ({ support }: Props) => {
    return (
        <div className="group p-6 rounded-[2rem] border bg-[var(--bg-side)] border-[var(--border-color)] transition-all hover:border-[var(--accent-purple)] shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div>
                        <h4 className="text-sm font-black text-[var(--text-primary)]">{support.username}</h4>
                        <div className="flex items-center gap-1.5 opacity-40 text-[10px] font-bold uppercase tracking-tighter">
                            <Clock size={10} />
                            {new Date(support.createTime).toLocaleString()}
                        </div>
                    </div>
                </div>
                <div className="p-2 rounded-xl bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]">
                    <MessageSquare size={16} />
                </div>
            </div>

            <div className="bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)]/50">
                <p className="text-sm font-medium text-[var(--text-primary)] opacity-80 leading-relaxed whitespace-pre-wrap">
                    {support.content}
                </p>
            </div>
        </div>
    );
};

export default SupportItem;