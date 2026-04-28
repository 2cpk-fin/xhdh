import { useState } from 'react';
import type { UserResponse } from "../types/user";
import { ShieldCheck, User as UserIcon, X } from 'lucide-react';

interface ProfileBoxProps {
    user: UserResponse;
}

const ProfileBox = ({ user }: ProfileBoxProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imageSrc = user.profileImage
        ? `data:image/jpeg;base64,${user.profileImage}`
        : '';

    return (
        <>
            <div className="w-full mb-10 bg-white dark:bg-[#000000] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 dark:bg-purple-900/10 rounded-full -mr-12 -mt-12 opacity-50 transition-colors" />

                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    <div className="relative shrink-0 cursor-pointer group/avatar" onClick={() => imageSrc && setIsModalOpen(true)}>
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-900 shadow-sm transition-all group-hover/avatar:border-purple-400">
                            {imageSrc ? (
                                <img src={imageSrc} alt="Profile" className="w-full h-full object-cover rounded-xl transition-transform group-hover/avatar:scale-105" />
                            ) : (
                                <div className="w-full h-full bg-zinc-50 dark:bg-zinc-950 rounded-xl flex items-center justify-center">
                                    <UserIcon className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-[#000000] rounded-full shadow-sm"></div>
                    </div>

                    <div className="flex flex-col justify-center text-center sm:text-left min-w-0">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors truncate">
                                {user.username}
                            </h2>
                            <ShieldCheck className="w-5 h-5 text-purple-500 shrink-0" />
                        </div>
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setIsModalOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <img
                        src={imageSrc}
                        alt="Full Profile"
                        className="max-w-full max-h-[90vh] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

export default ProfileBox;