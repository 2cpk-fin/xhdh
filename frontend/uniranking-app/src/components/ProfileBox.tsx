import type { UserResponse } from "../types/user";

interface ProfileBoxProps {
    user: UserResponse;
}

const ProfileBox = ({ user }: ProfileBoxProps) => {
    // We manually prepend the data string so the browser can read the raw Base64 from the backend
    const imageSrc = user.profileImage
        ? `data:image/jpeg;base64,${user.profileImage}`
        : '';

    return (
        <div className="bg-white dark:bg-[#000000] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm transition-colors duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                {/* Avatar with Status Indicator */}
                <div className="relative shrink-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[3px] border-purple-500 dark:border-purple-500 p-1 bg-zinc-50 dark:bg-zinc-900">
                        {imageSrc ? (
                            <img src={imageSrc} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                                <span className="text-zinc-400 dark:text-zinc-500 font-medium text-xs uppercase tracking-wider">No Img</span>
                            </div>
                        )}
                    </div>
                    {/* Green online/active dot */}
                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-[3px] border-white dark:border-[#000000] rounded-full"></div>
                </div>

                {/* User Details */}
                <div className="flex flex-col justify-center text-center sm:text-left h-full pt-2 sm:pt-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        {user.username}
                    </h2>

                    {/* Clean ID Badge */}
                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-full border border-zinc-200 dark:border-zinc-800">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                            ID: {user.publicUserId}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileBox;