import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer
            className="backdrop-blur-xl transition-all duration-300
            bg-[var(--bg-side)] border-t border-[var(--border-color)]"
        >
            <div className="max-w-7xl mx-auto px-8 md:px-12 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="font-black text-lg mb-3 text-[var(--accent-purple)] dark:text-[#e879f9]">
                            About
                        </h3>
                        <p className="text-sm leading-relaxed font-medium text-[var(--text-primary)] opacity-70">
                            University Ranking is a competitive platform for students to showcase
                            their skills and climb the global rankings.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-lg mb-3 text-[var(--accent-purple)] dark:text-[#e879f9]">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm font-bold">
                            {['News', 'Support'].map((label) => (
                                <li key={label}>
                                    <Link
                                        to={`/${label.toLowerCase()}`}
                                        className="text-[var(--text-primary)] opacity-60 hover:opacity-100 hover:text-[var(--accent-purple)] transition-all duration-200"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-6 flex flex-col md:flex-row items-center justify-between border-t border-[var(--border-color)] opacity-50">
                    <p className="text-xs font-bold flex items-center gap-1 text-[var(--text-primary)]">
                        © {year} University Ranking. Made with{' '}
                        <Heart className="w-3 h-3 text-red-500 fill-current" /> by the Team
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;