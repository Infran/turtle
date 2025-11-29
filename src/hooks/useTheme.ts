import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedPrefs = window.localStorage.getItem('theme');
            if (typeof storedPrefs === 'string') {
                return storedPrefs as Theme;
            }
        }
        return 'system'; // Default to system
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = () => {
            if (theme === 'dark') {
                root.classList.add('dark');
            } else if (theme === 'light') {
                root.classList.remove('dark');
            } else {
                // System mode
                if (mediaQuery.matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };

        applyTheme();

        const handleChange = () => {
            if (theme === 'system') {
                applyTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        localStorage.setItem('theme', theme);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light';
        });
    };

    return { theme, toggleTheme };
}
