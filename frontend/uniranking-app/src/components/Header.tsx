import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

const Header = () => {
    return (
        <header className="border-b border-zinc-200 bg-white/70 backdrop-blur-xl sticky top-0 z-50 h-16 flex items-center transition-all duration-300 shadow-sm">
            <div className="w-full px-6 md:px-8 flex items-center justify-between">
                <Link to="/home" className="flex items-center gap-3 group cursor-pointer">
                    <Trophy className="text-yellow-500 w-6 h-6 drop-shadow-sm group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black text-purple-600 uppercase tracking-[0.15em] group-hover:text-purple-500 transition-colors">
                        University Ranking
                    </span>
                </Link>

            </div>
        </header>
    );
};

export default Header;