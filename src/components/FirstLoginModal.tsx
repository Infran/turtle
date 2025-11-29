import { useState } from 'react';
import { useRegion, type Region, type Currency } from '../context/RegionContext';
import { useTranslation } from '../hooks/useTranslation';

interface FirstLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FirstLoginModal({ isOpen, onClose }: FirstLoginModalProps) {
    const { region, setRegion, currency, setCurrency, setPreferencesConfigured } = useRegion();
    const { t } = useTranslation();
    const [selectedRegion, setSelectedRegion] = useState<Region>(region);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currency);

    if (!isOpen) return null;

    const handleContinue = () => {
        setRegion(selectedRegion);
        setCurrency(selectedCurrency);
        setPreferencesConfigured();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-center mb-2">
                        <img src="/turtle.svg" alt="Turtle Finance" className="w-16 h-16" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
                        {t('firstLogin.welcome')}
                    </h2>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
                        {t('firstLogin.message')}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Language Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('settings.region')}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSelectedRegion('BR')}
                                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${selectedRegion === 'BR'
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span className="text-2xl">🇧🇷</span>
                                <span className="font-medium">{t('region.brazil')}</span>
                            </button>
                            <button
                                onClick={() => setSelectedRegion('US')}
                                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${selectedRegion === 'US'
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span className="text-2xl">🇺🇸</span>
                                <span className="font-medium">{t('region.unitedStates')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Currency Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('settings.currency')}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSelectedCurrency('BRL')}
                                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${selectedCurrency === 'BRL'
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span className="text-xl font-bold">R$</span>
                                <span className="font-medium">{t('currency.brl')}</span>
                            </button>
                            <button
                                onClick={() => setSelectedCurrency('USD')}
                                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${selectedCurrency === 'USD'
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span className="text-xl font-bold">$</span>
                                <span className="font-medium">{t('currency.usd')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={handleContinue}
                        className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                        {t('firstLogin.continue')}
                    </button>
                </div>
            </div>
        </div>
    );
}
