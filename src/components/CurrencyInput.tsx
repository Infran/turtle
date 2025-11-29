import { useRegion } from '../context/RegionContext';

interface CurrencyInputProps {
    value: number;
    onChange: (value: number) => void;
    required?: boolean;
    className?: string;
    placeholder?: string;
}

export default function CurrencyInput({ value, onChange, required = false, className = '', placeholder = '0,00' }: CurrencyInputProps) {
    const { currency } = useRegion();

    const formatCurrencyDisplay = (value: number): string => {
        if (value === 0) return '';

        // Format with thousands separators and 2 decimal places
        const formatted = (value / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return formatted;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        // Remove all non-digit characters
        const digitsOnly = input.replace(/\D/g, '');

        // Convert to number (value is in cents)
        const numValue = parseInt(digitsOnly || '0', 10);

        onChange(numValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
            return;
        }
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        if ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) && (e.ctrlKey === true || e.metaKey === true)) {
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    };

    const currencySymbol = currency === 'BRL' ? 'R$' : '$';

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                {currencySymbol}
            </span>
            <input
                type="text"
                inputMode="numeric"
                required={required}
                value={formatCurrencyDisplay(value)}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={`pl-10 ${className}`}
            />
        </div>
    );
}
