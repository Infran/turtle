import { useRegion } from '../context/RegionContext';
import { translations, type TranslationKey } from '../i18n/translations';

/**
 * Custom hook for translations
 * @returns Object with t function to get translated strings
 */
export function useTranslation() {
    const { region } = useRegion();

    // Map region to locale
    const locale = region === 'BR' ? 'pt-BR' : 'en-US';

    /**
     * Get translated string for a key
     * @param key - Translation key
     * @returns Translated string
     */
    const t = (key: TranslationKey): string => {
        return translations[locale][key] || key;
    };

    return { t, locale };
}
