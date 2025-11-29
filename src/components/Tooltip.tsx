import type { ReactNode } from 'react';

interface TooltipProps {
    children: ReactNode;
    text: string;
    visible: boolean;
}

export default function Tooltip({ children, text, visible }: TooltipProps) {
    return (
        <div className="relative flex items-center group">
            {children}
            {visible && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {text}
                </div>
            )}
        </div>
    );
}
