import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

const Header = () => {
    return (
        <header
            className="sticky top-0 z-50 h-16 flex items-center backdrop-blur-xl transition-all duration-300
            bg-[var(--bg-side)] border-b border-[var(--border-color)]
            shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_rgba(192,38,211,0.08),0_4px_24px_rgba(0,0,0,0.3)]"
        >
            <div className="w-full px-6 md:px-8 flex items-center justify-between">
                <Link to="/home" className="flex items-center gap-3 group cursor-pointer">
                    <Trophy
                        className="w-5 h-5 transition-transform duration-300 group-hover:scale-110
                        text-[#eab308] dark:text-[#facc15]
                        drop-shadow-[0_1px_2_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_8px_rgba(250,204,21,0.55)]"
                    />
                    <span
                        className="text-xs font-black uppercase tracking-[0.15em] transition-all duration-200
                        text-[var(--accent-purple)] dark:text-[#e879f9]
                        dark:drop-shadow-[0_0_16px_rgba(232,121,249,0.45)]"
                    >
                        University Ranking
                    </span>
                </Link>
            </div>
        </header>
    );
};

export default Header;