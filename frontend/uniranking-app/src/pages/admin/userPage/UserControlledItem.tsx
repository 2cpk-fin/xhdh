import { User, Mail, Trash2 } from 'lucide-react'
import type { UserResponse } from '../../../types/user'

type Props = {
    user: UserResponse
    onClick: () => void
}

export default function UserControlledItem({ user, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            className="group flex items-center justify-between px-5 py-4 rounded-2xl bg-[var(--bg-side)] border border-[var(--border-color)] shadow-sm hover:shadow-md hover:border-red-500 cursor-pointer transition-all active:scale-[0.99]"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
                    <User size={18} className="text-[var(--text-primary)] opacity-40 group-hover:text-red-500 group-hover:opacity-100 transition-all" />
                </div>

                <div className="min-w-0">
                    <div className="font-black text-[var(--text-primary)] text-sm group-hover:text-red-500 transition-colors truncate">
                        {user.username}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[var(--text-primary)] opacity-40 font-medium mt-0.5 truncate">
                        <Mail size={11} />
                        {user.email}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 ml-4 shrink-0">
                <span className="text-[10px] font-black tracking-widest text-[var(--text-primary)] opacity-20 hidden sm:block">
                    #{user.id}
                </span>
                <div className="p-2 rounded-xl bg-[var(--bg-main)] text-[var(--text-primary)] opacity-40 group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                </div>
            </div>
        </div>
    )
}