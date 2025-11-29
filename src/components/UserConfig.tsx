import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { useLayoutConfig } from '../context/LayoutContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface UserConfigProps {
    compact?: boolean;
    direction?: 'up' | 'down';
    align?: 'left' | 'right';
}

export default function UserConfig({ compact = false, direction = 'down', align = 'right' }: UserConfigProps) {
    const { user, signIn, signOut } = useGoogleSheets();
    const { theme, toggleTheme } = useTheme();
    const { layoutMode, toggleLayoutMode, mobileLayoutMode, toggleMobileLayoutMode } = useLayoutConfig();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const navigate = useNavigate();



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) {
        return compact ? (
            <button onClick={() => signIn()} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md" title="Sign In">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            </button>
        ) : (
            <button
                onClick={() => signIn()}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                <span className="font-medium">{t('auth.signIn')}</span>
            </button>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center ${compact ? 'justify-center px-0 py-2' : 'space-x-3 px-4 py-3'} w-full rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none cursor-pointer`}
            >
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover shrink-0" />
                {!compact && (
                    <div className="flex-1 text-left overflow-hidden">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                )}
                {!compact && (
                    <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                )}
            </button>

            {isOpen && (
                <div className={`absolute ${direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} ${align === 'right' ? 'right-0' : 'left-0'} w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50 min-w-[200px]`}>
                    <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 py-1">Settings</p>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                        >
                            <div className="flex items-center space-x-2">
                                {theme === 'light' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                ) : theme === 'dark' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                )}
                                <span>{t('settings.theme')}: {theme === 'light' ? t('theme.light') : theme === 'dark' ? t('theme.dark') : t('theme.system')}</span>
                            </div>
                        </button>

                        {/* Layout Toggle - Desktop: Sidebar/Header, Mobile: Drawer/Bottom */}
                        {isDesktop ? (
                            <button
                                onClick={toggleLayoutMode}
                                className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                            >
                                <div className="flex items-center space-x-2">
                                    {layoutMode === 'sidebar' ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                    )}
                                    <span>{t('settings.layout')}: {layoutMode === 'sidebar' ? t('layout.sidebar') : t('layout.header')}</span>
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={toggleMobileLayoutMode}
                                className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                            >
                                <div className="flex items-center space-x-2">
                                    {mobileLayoutMode === 'drawer' ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                    )}
                                    <span>{t('settings.mobileLayout')}: {mobileLayoutMode === 'drawer' ? t('layout.drawer') : t('layout.bottom')}</span>
                                </div>
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/settings');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>{t('menu.settings')}</span>
                    </button>

                    <div className="p-2">
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                            <span>{t('auth.signOut')}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
