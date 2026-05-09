import { ShieldCheck } from 'lucide-react';

const ControlPage = () => {
    return (
        <div className="max-w-4xl mx-auto mt-16 px-4 flex justify-center">
            <div className="bg-white border border-purple-100 rounded-[2rem] p-10 sm:p-16 shadow-sm flex flex-col items-center text-center max-w-2xl w-full">

                {/* Icon Container */}
                <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center text-purple-600 mb-8 shadow-inner">
                    <ShieldCheck size={40} strokeWidth={1.5} />
                </div>

                {/* Greeting Text */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-4">
                    Welcome to the Control Room
                </h1>

                <p className="text-zinc-500 text-base sm:text-lg max-w-md leading-relaxed">
                    You have elevated access privileges. Use the navigation menu above to manage scheduled matches and oversee user accounts.
                </p>

            </div>
        </div>
    );
};

export default ControlPage;