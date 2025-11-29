import type { Region } from '../context/RegionContext';
import type { Currency } from '../context/RegionContext';

/**
 * Format currency based on currency code
 * @param amount - The amount to format
 * @param currency - The currency code ('BRL' | 'USD' | 'EUR' | 'GBP')
 * @param region - Optional region for locale formatting
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: Currency, region?: Region): string {
    const locale = region === 'BR' ? 'pt-BR' : 'en-US';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Format date based on region
 * @param date - The date to format
 * @param region - The region ('US' or 'BR')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, region: Region): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (region === 'BR') {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(dateObj);
    } else {
        return new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        }).format(dateObj);
    }
}

/**
 * Format number based on region
 * @param num - The number to format
 * @param region - The region ('US' or 'BR')
 * @returns Formatted number string
 */
export function formatNumber(num: number, region: Region): string {
    if (region === 'BR') {
        return new Intl.NumberFormat('pt-BR').format(num);
    } else {
        return new Intl.NumberFormat('en-US').format(num);
    }
}

/**
 * Get currency symbol for currency code
 * @param currency - The currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
    const symbols: Record<Currency, string> = {
        'BRL': 'R$',
        'USD': '$'
    };
    return symbols[currency];
}

/**
 * Get currency name for currency code
 * @param currency - The currency code
 * @returns Currency name
 */
export function getCurrencyName(currency: Currency): string {
    const names: Record<Currency, string> = {
        'BRL': 'Brazilian Real',
        'USD': 'US Dollar'
    };
    return names[currency];
}
