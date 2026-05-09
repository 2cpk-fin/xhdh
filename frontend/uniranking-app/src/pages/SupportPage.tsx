import { useState } from 'react';
import { Coffee, Coins, HeartCrack, Rocket, Ghost, Search } from 'lucide-react';

const SupportPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-gray-950 pt-24 px-6 pb-20 flex flex-col items-center">
            <div className="max-w-3xl w-full text-center mb-16">
                <div className="inline-flex p-4 bg-red-100 dark:bg-red-950 text-red-600 dark:text-error-light rounded-3xl mb-6 animate-bounce">
                    <HeartCrack size={40} />
                </div>
                <h1 className="text-5xl font-black text-zinc-900 dark:text-gray-100 tracking-tight mb-4">
                    Support <span className="text-purple-600 dark:text-brand-primary-light">Me?</span>
                </h1>
                <p className="text-zinc-500 dark:text-gray-400 text-lg font-bold">
                    Honestly, the developer is currently running on instant noodles and pure hope.
                    Your support is my only chance to survive this internship.
                </p>
            </div>

            <div className="max-w-2xl w-full mb-20">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for answers we don't have..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-6 pl-14 bg-white dark:bg-gray-900 border-2 border-zinc-200 dark:border-gray-700 rounded-[2rem] text-sm font-bold text-zinc-900 dark:text-gray-100 placeholder-zinc-500 dark:placeholder-gray-500 focus:outline-none focus:border-purple-400 dark:focus:border-brand-primary-light shadow-sm dark:shadow-md transition-all"
                    />
                    <Search className="absolute left-6 top-6 text-zinc-400 dark:text-gray-600" />

                    {searchQuery && (
                        <div className="mt-4 p-6 bg-zinc-900 dark:bg-gray-800 text-zinc-400 dark:text-gray-300 rounded-3xl text-sm font-bold flex items-center gap-3">
                            <Ghost className="text-purple-500 dark:text-brand-primary-light" />
                            "404 Hope Not Found. Stop searching and start donating."
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                <div className="p-8 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm dark:shadow-md">
                    <h3 className="text-xl font-black text-zinc-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Rocket className="text-blue-500 dark:text-info-light" /> Fast Rankings?
                    </h3>
                    <p className="text-sm font-bold text-zinc-500 dark:text-gray-400 leading-relaxed">
                        If you want the global rankings to update faster, please understand that
                        server electricity isn't free. My bank account is currently $0.02.
                    </p>
                </div>

                <div className="p-8 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm dark:shadow-md">
                    <h3 className="text-xl font-black text-zinc-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Coffee className="text-amber-600 dark:text-highlight-light" /> Bug Report?
                    </h3>
                    <p className="text-sm font-bold text-zinc-500 dark:text-gray-400 leading-relaxed">
                        I call them "Surprise Features". If you hate them, 1 cup of coffee = 1 bug fixed (maybe).
                    </p>
                </div>
            </div>

            <div className="w-full max-w-2xl p-1 bg-gradient-to-r from-purple-500 dark:from-brand-primary via-pink-500 dark:via-error to-red-500 dark:to-error-light rounded-[3rem]">
                <div className="bg-zinc-950 dark:bg-gray-900 rounded-[2.8rem] p-10 text-center">
                    <h2 className="text-3xl font-black text-white dark:text-gray-100 mb-2">Emergency Fund</h2>
                    <p className="text-zinc-500 dark:text-gray-400 font-bold mb-8">Current Hunger Level: <span className="text-red-500 dark:text-error-light animate-pulse">CRITICAL</span></p>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {[5, 10, 50, 100].map(amount => (
                            <button
                                key={amount}
                                onClick={() => alert("My bank account is waiting for you!")}
                                className="px-6 py-3 bg-zinc-800 dark:bg-gray-800 border border-zinc-700 dark:border-gray-700 text-white dark:text-gray-100 font-black rounded-2xl hover:bg-zinc-700 dark:hover:bg-gray-700 hover:border-purple-500 dark:hover:border-brand-primary-light transition-all"
                            >
                                ${amount}
                            </button>
                        ))}
                    </div>

                    <button
                        className="w-full py-5 bg-white dark:bg-brand-primary text-zinc-950 dark:text-white text-lg font-black rounded-3xl hover:bg-purple-500 dark:hover:bg-brand-primary-light hover:text-white dark:hover:text-gray-950 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Coins size={24} />
                        PLS DONATE ME (I'M BROKE)
                    </button>
                    <p className="mt-6 text-[10px] text-zinc-600 dark:text-gray-500 font-bold uppercase tracking-widest">
                        By clicking, you accept that you won't get your money back. Ever.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;