import { Heart, GitBranch, Mail } from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white/70 border-t border-zinc-200 text-zinc-700 backdrop-blur-xl transition-all duration-300">
            <div className="max-w-7xl mx-auto px-8 md:px-12 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="font-black text-lg mb-3 text-purple-600">About</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                            University Ranking is a competitive platform for students to showcase their skills and climb the global rankings.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-lg mb-3 text-purple-600">Quick Links</h3>
                        <ul className="space-y-2 text-sm font-bold text-zinc-500">
                            <li><a href="#" className="hover:text-purple-600 transition-colors">Community</a></li>
                            <li><a href="#" className="hover:text-purple-600 transition-colors">Leaderboards</a></li>
                            <li><a href="#" className="hover:text-purple-600 transition-colors">News</a></li>
                            <li><a href="#" className="hover:text-purple-600 transition-colors">Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-lg mb-3 text-purple-600">Connect</h3>
                        <div className="flex gap-4">
                            <a href="#" className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:border-purple-300 hover:bg-purple-50 text-zinc-400 hover:text-purple-600 transition-all shadow-sm">
                                <GitBranch className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:border-purple-300 hover:bg-purple-50 text-zinc-400 hover:text-purple-600 transition-all shadow-sm">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-200/80 pt-6 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                        © {year} University Ranking. Made with <Heart className="w-3 h-3 text-red-500" /> by the Team
                    </p>
                    <div className="flex gap-6 text-xs font-bold text-zinc-400 mt-4 md:mt-0">
                        <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;