import { useState, type JSX } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import UserConfig from './UserConfig';

interface HeaderProps {
    navLinks: Array<{ name: string; path: string; icon: JSX.Element }>;
}

export default function Header({ navLinks }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();

    const nameToKeyMap: Record<string, string> = {
        'Home': 'nav.home',
        'Expenses': 'nav.expenses',
        'About': 'nav.about'
    };

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-20 h-16">
            <div className="max-w-screen mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo & Mobile Toggle */}
                <div className="flex items-center space-x-4">
                    <button
                        className="md:hidden text-gray-500 dark:text-gray-400 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">Turtle</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                                }`
                            }
                        >
                            {link.icon}
                            <span>{t(nameToKeyMap[link.name] as any)}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Config */}
                <div className="flex justify-end">
                    <div className="w-full max-w-[200px]">
                        <UserConfig direction="down" />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pt-2 pb-4 shadow-lg">
                    <nav className="flex flex-col space-y-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 px-4 py-3 rounded-md text-base font-medium transition-colors ${isActive
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`
                                }
                            >
                                {link.icon}
                                <span>{t(nameToKeyMap[link.name] as any)}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
