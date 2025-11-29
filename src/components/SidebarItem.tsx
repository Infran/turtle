import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Tooltip from './Tooltip';

interface SidebarItemProps {
    icon: ReactNode;
    label: string;
    to: string;
    isCollapsed: boolean;
}

export default function SidebarItem({ icon, label, to, isCollapsed }: SidebarItemProps) {
    return (
        <Tooltip text={label} visible={isCollapsed}>
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out w-full ${isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                    } ${isCollapsed ? 'justify-center' : ''}`
                }
            >
                <span className="shrink-0">{icon}</span>
                {!isCollapsed && (
                    <span className="ml-3 whitespace-nowrap overflow-hidden transition-opacity duration-300">
                        {label}
                    </span>
                )}
            </NavLink>
        </Tooltip>
    );
}
