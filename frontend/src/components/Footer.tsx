import { useEffect, useState } from 'react';
import { Heart, GitBranch, Mail } from 'lucide-react';

const Footer = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  useEffect(() => {
    const onThemeChange = () => {
      const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(fromStorage);
    };
    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  const isDark = theme === 'dark';
  const year = new Date().getFullYear();

  return (
    <footer className={`${isDark ? 'bg-black/80 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-700'} border-t backdrop-blur-xl transition-all duration-300`}>
      <div className="max-w-full mx-auto px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3 text-purple-500">About</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              University Ranking is a competitive platform for students to showcase their skills and climb the global rankings.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 text-purple-500">Quick Links</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-purple-500 transition">Community</a></li>
              <li><a href="#" className="hover:text-purple-500 transition">Leaderboards</a></li>
              <li><a href="#" className="hover:text-purple-500 transition">News</a></li>
              <li><a href="#" className="hover:text-purple-500 transition">Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 text-purple-500">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg hover:bg-purple-500/10 transition">
                <GitBranch className="w-5 h-5 text-purple-500" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-purple-500/10 transition">
                <Mail className="w-5 h-5 text-purple-500" />
              </a>
            </div>
          </div>
        </div>

        <div className={`border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'} pt-6 flex flex-col md:flex-row items-center justify-between`}>
          <p className="text-xs opacity-50 flex items-center gap-1">
            © {year} University Ranking. Made with <Heart className="w-3 h-3 text-red-500" /> by the Team
          </p>
          <div className="flex gap-6 text-xs opacity-50 mt-4 md:mt-0">
            <a href="#" className="hover:text-purple-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-purple-500 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

