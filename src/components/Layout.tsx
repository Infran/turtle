import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import Header from './Header';
import BottomNav from './BottomNav';
import UserConfig from './UserConfig';
import SetupWizard from './SetupWizard';
import { useLayoutConfig } from '../context/LayoutContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTranslation } from '../hooks/useTranslation';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { Wallet, CreditCard } from 'lucide-react';

export default function Layout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showSetupWizard, setShowSetupWizard] = useState(false);
    const { pathname } = useLocation();
    const { layoutMode, mobileLayoutMode } = useLayoutConfig();
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const { t } = useTranslation();
    const { user } = useGoogleSheets();

    // Show setup wizard on first login
    useEffect(() => {
        const wizardCompleted = localStorage.getItem('setupWizardCompleted');
        if (user && !wizardCompleted) {
            setShowSetupWizard(true);
        }
    }, [user]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const navLinks = [
        {
            name: 'Home', path: '/', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            )
        },
        {
            name: 'Incomes', path: '/incomes', icon: (
                <Wallet className="w-6 h-6" />
            )
        },
        {
            name: 'Expenses', path: '/expenses', icon: (
                <CreditCard className="w-6 h-6" />
            )
        },
        {
            name: 'About', path: '/about', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
        },
    ];

    // Map nav link names to translation keys
    const nameToKeyMap: Record<string, string> = {
        'Home': 'nav.home',
        'Incomes': 'nav.incomes',
        'Expenses': 'nav.expenses',
        'About': 'nav.about'
    };

    const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

    // Only use Header layout if in header mode AND on desktop
    if (layoutMode === 'header' && isDesktop) {
        // Show only wizard if active - block entire app
        if (showSetupWizard) {
            return (
                <SetupWizard
                    onComplete={() => setShowSetupWizard(false)}
                    onClose={() => {
                        localStorage.setItem('setupWizardCompleted', 'true');
                        setShowSetupWizard(false);
                    }}
                />
            );
        }

        return (
            <div className="max-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Header navLinks={navLinks} />
                <main className={`mt-16 h-[calc(100vh-4rem)] ${pathname === '/settings' ? 'px-0' : 'max-w-7xl px-4 mx-auto'}`}>
                    <Outlet />
                </main>
            </div>
        );
    }

    // Mobile Bottom Nav Mode
    if (!isDesktop && mobileLayoutMode === 'bottom') {
        // Show only wizard if active - block entire app
        if (showSetupWizard) {
            return (
                <SetupWizard
                    onComplete={() => setShowSetupWizard(false)}
                    onClose={() => {
                        localStorage.setItem('setupWizardCompleted', 'true');
                        setShowSetupWizard(false);
                    }}
                />
            );
        }

        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
                {/* Top Bar for Logo/User */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 p-4 flex justify-between items-center sticky top-0 z-20 shrink-0 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center transform transition-transform active:scale-95">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">Turtle</span>
                    </div>

                    {/* User Config in Top Bar for Bottom Nav Mode - Aligned Right */}
                    <UserConfig compact={true} direction="down" align="right" />
                </div>

                <main className={`flex-1 w-full mx-auto ${pathname === '/settings' ? 'p-0' : 'max-w-7xl pt-4 px-4 pb-28'}`}>
                    <Outlet />
                </main>

                {pathname !== '/settings' && <BottomNav navLinks={navLinks} />}
            </div>
        );
    }
    // Default: Sidebar Layout
    // Show only wizard if active - block entire app
    if (showSetupWizard) {
        return (
            <SetupWizard
                onComplete={() => setShowSetupWizard(false)}
                onClose={() => {
                    localStorage.setItem('setupWizardCompleted', 'true');
                    setShowSetupWizard(false);
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Mobile Header (Drawer Mode) */}
            <div className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 p-4 flex justify-between items-center sticky top-0 z-20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center transform transition-transform active:scale-95">
                        <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">Turtle</span>
                </div>
                <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-gray-500 dark:text-gray-400 focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex flex-col ${sidebarWidth} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed inset-y-0 left-0 z-10 transition-all duration-300 ease-in-out`}
            >
                <div className={`h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700`}>
                    <div className={`flex items-center space-x-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">Turtle</span>
                    </div>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none ${isCollapsed ? 'mx-auto' : ''}`}
                    >
                        {isCollapsed ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                        )}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    {navLinks.map((link) => (
                        <SidebarItem
                            key={link.path}
                            to={link.path}
                            icon={link.icon}
                            label={t(nameToKeyMap[link.name] as any)}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </nav>

                {/* User Config at Bottom */}
                <div className={`p-4 border-t border-gray-200 dark:border-gray-700`}>
                    <UserConfig compact={isCollapsed} direction="up" align="left" />
                </div>
            </aside>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 z-100 md:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
                <div className={`absolute inset-y-0 left-0 w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl transform transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-primary-600 rounded-lg shadow-md flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">Turtle</span>
                        </div>
                        <button onClick={() => setIsMobileOpen(false)} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <nav className="p-4 space-y-2">
                        {navLinks.map((link) => (
                            <SidebarItem
                                key={link.path}
                                to={link.path}
                                icon={link.icon}
                                label={t(nameToKeyMap[link.name] as any)}
                                isCollapsed={false}
                            />
                        ))}
                    </nav>
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50">
                        <UserConfig direction="up" align="left" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={`transition-all duration-300 ease-in-out ${pathname === '/settings' ? 'p-0' : 'pt-8 md:pt-8 px-4 pb-8'} ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <div className={`${pathname === '/settings' ? 'h-full' : 'max-w-7xl mx-auto'}`}>
                    <Outlet />
                </div>
            </main>
        </div >
    );
}
