import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white/70 border-t border-zinc-200 text-zinc-700 backdrop-blur-xl transition-all duration-300">
            <div className="max-w-7xl mx-auto px-8 md:px-12 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="font-black text-lg mb-3 text-purple-600">About</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                            University Ranking is a competitive platform for students to showcase their skills and climb the global rankings.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-lg mb-3 text-purple-600">Quick Links</h3>
                        <ul className="space-y-2 text-sm font-bold text-zinc-500">
                            <li><Link to="/news" className="hover:text-purple-600 transition-colors">News</Link></li>
                            <li><Link to="/support" className="hover:text-purple-600 transition-colors">Support</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-200/80 pt-6 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                        © {year} University Ranking. Made with <Heart className="w-3 h-3 text-red-500" /> by the Team
                    </p>
                    <div className="flex gap-6 text-xs font-bold text-zinc-400 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-purple-600 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-purple-600 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;