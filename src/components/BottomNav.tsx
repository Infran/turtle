import { NavLink } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface NavLinkItem {
    name: string;
    path: string;
    icon: React.ReactNode;
}

interface BottomNavProps {
    navLinks: NavLinkItem[];
}

export default function BottomNav({ navLinks }: BottomNavProps) {
    const { t } = useTranslation();

    // Map nav link names to translation keys
    const nameToKeyMap: Record<string, string> = {
        'Home': 'nav.home',
        'Incomes': 'nav.incomes',
        'Expenses': 'nav.expenses',
        'About': 'nav.about'
    };

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl flex justify-around items-center h-16 z-50">
            {navLinks.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 rounded-xl transition-all duration-200 ${isActive
                            ? 'text-primary-600 dark:text-primary-400 scale-110'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`
                    }
                >
                    <div className="w-6 h-6">{link.icon}</div>
                    <span className="text-[10px] font-medium">{t(nameToKeyMap[link.name] as any)}</span>
                </NavLink>
            ))}
        </div>
    );
}
