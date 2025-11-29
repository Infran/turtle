import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type LayoutMode = 'sidebar' | 'header';
type MobileLayoutMode = 'drawer' | 'bottom';

interface LayoutContextType {
    layoutMode: LayoutMode;
    setLayoutMode: (mode: LayoutMode) => void;
    toggleLayoutMode: () => void;
    mobileLayoutMode: MobileLayoutMode;
    setMobileLayoutMode: (mode: MobileLayoutMode) => void;
    toggleMobileLayoutMode: () => void;
    mobileStyle: 'apple' | 'android';
    setMobileStyle: (style: 'apple' | 'android') => void;
    toggleMobileStyle: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
    const [layoutMode, setLayoutModeState] = useState<LayoutMode>(() => {
        const savedMode = localStorage.getItem('layoutMode');
        return (savedMode === 'sidebar' || savedMode === 'header') ? savedMode : 'sidebar';
    });

    const [mobileLayoutMode, setMobileLayoutModeState] = useState<MobileLayoutMode>(() => {
        const savedMode = localStorage.getItem('mobileLayoutMode');
        return (savedMode === 'drawer' || savedMode === 'bottom') ? savedMode : 'drawer';
    });

    const [mobileStyle, setMobileStyleState] = useState<'apple' | 'android'>(() => {
        const savedStyle = localStorage.getItem('mobileStyle');
        return (savedStyle === 'apple' || savedStyle === 'android') ? savedStyle : 'apple';
    });

    useEffect(() => {
        localStorage.setItem('layoutMode', layoutMode);
    }, [layoutMode]);

    useEffect(() => {
        localStorage.setItem('mobileLayoutMode', mobileLayoutMode);
    }, [mobileLayoutMode]);

    useEffect(() => {
        localStorage.setItem('mobileStyle', mobileStyle);
    }, [mobileStyle]);

    const setLayoutMode = (mode: LayoutMode) => {
        setLayoutModeState(mode);
    };

    const toggleLayoutMode = () => {
        setLayoutModeState(prev => prev === 'sidebar' ? 'header' : 'sidebar');
    };

    const setMobileLayoutMode = (mode: MobileLayoutMode) => {
        setMobileLayoutModeState(mode);
    };

    const toggleMobileLayoutMode = () => {
        setMobileLayoutModeState(prev => prev === 'drawer' ? 'bottom' : 'drawer');
    };

    const setMobileStyle = (style: 'apple' | 'android') => {
        setMobileStyleState(style);
    };

    const toggleMobileStyle = () => {
        setMobileStyleState(prev => prev === 'apple' ? 'android' : 'apple');
    };

    return (
        <LayoutContext.Provider value={{
            layoutMode,
            setLayoutMode,
            toggleLayoutMode,
            mobileLayoutMode,
            setMobileLayoutMode,
            toggleMobileLayoutMode,
            mobileStyle,
            setMobileStyle,
            toggleMobileStyle
        }}>
            {children}
        </LayoutContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLayoutConfig = () => {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayoutConfig must be used within a LayoutProvider');
    }
    return context;
};
