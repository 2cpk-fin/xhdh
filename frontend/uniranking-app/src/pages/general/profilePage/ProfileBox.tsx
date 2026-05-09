import { useState } from 'react';
import type { UserResponse } from "../../../types/user";
import { ShieldCheck, User as UserIcon, X } from 'lucide-react';

const ProfileBox = ({ user }: { user: UserResponse }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const imageSrc = user.profileImage && !imgError
        ? (user.profileImage.startsWith('data:') || user.profileImage.startsWith('http')
            ? user.profileImage
            : `data:image/jpeg;base64,${user.profileImage}`)
        : null;

    return (
        <>
            <div className="w-full mb-10 bg-[var(--bg-side)] border border-[var(--border-color)] rounded-[2.5rem] p-6 shadow-sm hover:shadow-md hover:border-[var(--accent-purple)]/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-purple)]/5 rounded-full -mr-12 -mt-12 opacity-50" />

                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    <div className="relative shrink-0 cursor-pointer group/avatar" onClick={() => imageSrc && setIsModalOpen(true)}>
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[var(--border-color)] p-1 bg-[var(--bg-side)] shadow-sm transition-all group-hover/avatar:border-[var(--accent-purple)]">
                            {imageSrc ? (
                                <img src={imageSrc} alt="Profile" onError={() => setImgError(true)} className="w-full h-full object-cover rounded-xl transition-transform group-hover/avatar:scale-105" />
                            ) : (
                                <div className="w-full h-full bg-[var(--text-primary)]/5 rounded-xl flex items-center justify-center">
                                    <UserIcon className="w-8 h-8 text-[var(--text-primary)] opacity-20" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[var(--bg-side)] rounded-full shadow-sm"></div>
                    </div>

                    <div className="flex flex-col justify-center text-center sm:text-left min-w-0">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight group-hover:text-[var(--accent-purple)] transition-colors truncate">
                                {user.username}
                            </h2>
                            <ShieldCheck className="w-5 h-5 text-[var(--accent-purple)] shrink-0" />
                        </div>
                        <p className="text-xs font-bold text-[var(--text-primary)] opacity-40 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>

            {isModalOpen && imageSrc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
                    <button className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors" onClick={() => setIsModalOpen(false)}>
                        <X className="w-8 h-8" />
                    </button>
                    <img src={imageSrc} alt="Full Profile" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </>
    );
};

export default ProfileBox;