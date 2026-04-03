import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EventPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  useEffect(() => {
    const onThemeChange = () => {
      const updated = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(updated);
    };

    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-black text-white' : 'bg-white text-black';
  const cardClass = isDark ? 'bg-black/80 border border-purple-500/30' : 'bg-white border border-black/10';

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${bgClass}`}>
      <div className={`${cardClass} rounded-2xl p-8 shadow-xl max-w-2xl w-full`}>
        <h1 className="text-3xl font-bold mb-4 text-black-600">Event Mode</h1>
        <p className={`${isDark ? 'text-black-200' : 'text-black-800'} mb-6`}>
          Event mode is coming soon! Check in later for scheduled competitions, live leaderboards, and tournament formats.
        </p>
        <Link
          to="/home"
          className={`inline-block px-4 py-2 rounded-xl font-medium transition ${isDark ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-200 hover:bg-purple-300 text-black'}`}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default EventPage;
