import { useState, useEffect, useCallback } from 'react';

type DarkModeState = 'dark' | 'light';

export const useDarkMode = () => {
    const [theme, setTheme] = useState<DarkModeState>(() => {
        if (typeof window === 'undefined') return 'light';

        const stored = localStorage.getItem('darkMode');
        if (stored === 'dark' || stored === 'light') {
            return stored;
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    });

    useEffect(() => {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        localStorage.setItem('darkMode', theme);
    }, [theme]);

    const toggleDarkMode = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    return {
        isDarkMode: theme === 'dark',
        toggleDarkMode,
    };
};