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
            className="group flex items-center justify-between px-5 py-4 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-red-200 cursor-pointer transition-all"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                    <User size={18} className="text-zinc-400" />
                </div>

                <div className="min-w-0">
                    <div className="font-black text-zinc-800 text-sm group-hover:text-red-600 transition-colors truncate">
                        {user.username}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-400 font-medium mt-0.5 truncate">
                        <Mail size={11} />
                        {user.email}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 ml-4 shrink-0">
                <span className="text-xs font-mono font-bold text-zinc-400 hidden sm:block">
                    #{user.id}
                </span>
                <div className="p-2 rounded-xl bg-zinc-100 text-zinc-400 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                </div>
            </div>
        </div>
    )
}