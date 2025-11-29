import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        // Check if window is available (for SSR safety, though this is a client-side app)
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

        // Update matches if it changed since initialization (unlikely but safe)
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]); // Removed 'matches' from dependency array to avoid loop

    return matches;
}
