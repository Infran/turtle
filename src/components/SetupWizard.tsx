import { useState } from 'react';
import { useGoogleSheets, useRegion } from '@/context';
import { useTranslation } from '@/hooks';
import { X, Check, Sparkles } from 'lucide-react';
import { CurrencyInput } from '@/components';
import { getBanksByRegion, getBankById } from '@/data';

interface SetupWizardProps {
    onComplete: () => void;
    onClose: () => void;
}

export default function SetupWizard({ onComplete, onClose }: SetupWizardProps) {
    const { t } = useTranslation();
    const { setSpreadsheetId, setIncomeSheetId } = useGoogleSheets();
    const { region, setRegion, currency, setCurrency, addBankAccount, addExpenseCategory, expenseCategories, removeExpenseCategory } = useRegion();
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

    // Form states
    const [expenseSheetId, setExpenseSheetId] = useState('');
    const [incomeSheetIdInput, setIncomeSheetIdInput] = useState('');
    const [bankAccount, setBankAccount] = useState({
        bankName: '', // Will store bank ID now
        accountType: 'Checking' as 'Checking' | 'Savings',
        initialBalance: 0
    });
    const [newCategory, setNewCategory] = useState('');

    const steps = [
        { key: 'welcome', labelKey: 'wizard.step.welcome' },
        { key: 'spreadsheet', labelKey: 'wizard.step.spreadsheet' },
        { key: 'account', labelKey: 'wizard.step.account' },
        { key: 'categories', labelKey: 'wizard.step.categories' },
        { key: 'complete', labelKey: 'wizard.step.complete' },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setDirection('forward');
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection('backward');
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        handleNext();
    };

    const handleComplete = () => {
        // Save spreadsheet IDs if provided
        if (expenseSheetId) setSpreadsheetId(expenseSheetId);
        if (incomeSheetIdInput) setIncomeSheetId(incomeSheetIdInput);

        // Save bank account if bank is selected
        if (bankAccount.bankName) {
            const selectedBank = getBankById(bankAccount.bankName);
            addBankAccount({
                ...bankAccount,
                bankName: selectedBank?.name || bankAccount.bankName,
                initialBalance: bankAccount.initialBalance / 100
            });
        }

        // Mark wizard as completed and close
        localStorage.setItem('setupWizardCompleted', 'true');
        onComplete();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 md:items-center md:p-4">
            {/* Desktop: Centered Modal, Mobile: Bottom Sheet */}
            <div className="bg-white dark:bg-gray-900 w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-[90vh] overflow-hidden">
                {/* Drag Handle (Mobile Only) */}
                <div className="md:hidden flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Step {currentStep + 1} of {steps.length}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {currentStep === 0 ? t('wizard.welcome.title') : t(steps[currentStep].labelKey as import('../i18n/translations').TranslationKey)}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-2 mt-4">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-300 ${index < currentStep
                                    ? 'w-2 bg-primary-600'
                                    : index === currentStep
                                        ? 'w-8 bg-primary-600'
                                        : 'w-2 bg-gray-300 dark:bg-gray-700'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div
                        key={currentStep}
                        className={`animate-slide-${direction === 'forward' ? 'left' : 'right'}`}
                    >
                        <style>{`
                            @keyframes slide-left {
                                from { opacity: 0; transform: translateX(20px); }
                                to { opacity: 1; transform: translateX(0); }
                            }
                            @keyframes slide-right {
                                from { opacity: 0; transform: translateX(-20px); }
                                to { opacity: 1; transform: translateX(0); }
                            }
                            .animate-slide-left {
                                animation: slide-left 0.3s ease-out;
                            }
                            .animate-slide-right {
                                animation: slide-right 0.3s ease-out;
                            }
                        `}</style>
                        {/* Step 0: Welcome */}
                        {currentStep === 0 && (
                            <div className="text-center space-y-6">
                                <div className="text-6xl">🐢</div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        {t('wizard.welcome.title')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {t('wizard.welcome.description')}
                                    </p>
                                </div>

                                {/* Language Selection */}
                                <div className="max-w-sm mx-auto space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('settings.region')}
                                        </label>
                                        <select
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value as 'US' | 'BR')}
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-center text-lg"
                                        >
                                            <option value="BR">🇧🇷 Português (Brasil)</option>
                                            <option value="US">🇺🇸 English (US)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('settings.currency')}
                                        </label>
                                        <select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value as 'BRL' | 'USD')}
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-center text-lg"
                                        >
                                            <option value="BRL">R$ BRL</option>
                                            <option value="USD">$ USD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Spreadsheets */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t('wizard.spreadsheet.description')}
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('settings.spreadsheetId')}
                                        </label>
                                        <input
                                            type="text"
                                            value={expenseSheetId}
                                            onChange={(e) => setExpenseSheetId(e.target.value)}
                                            placeholder={t('settings.spreadsheet.placeholder')}
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('settings.incomeSheetId')}
                                        </label>
                                        <input
                                            type="text"
                                            value={incomeSheetIdInput}
                                            onChange={(e) => setIncomeSheetIdInput(e.target.value)}
                                            placeholder={t('settings.spreadsheet.placeholder')}
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('wizard.spreadsheet.skip')}
                                </p>
                            </div>
                        )}

                        {/* Step 2: Bank Account */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t('wizard.account.description')}
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('settings.bankName')} *
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={bankAccount.bankName}
                                                onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })}
                                                className="w-full p-4 pl-14 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                                            >
                                                <option value="" className='hidden'>{t('settings.account.bankPlaceholder')}</option>
                                                {getBanksByRegion(region).map((bank) => (
                                                    <option key={bank.id} value={bank.id}>
                                                        {bank.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* Bank color indicator */}
                                            {bankAccount.bankName && (
                                                <div
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"
                                                    style={{ backgroundColor: getBankById(bankAccount.bankName)?.color }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {/* Account Name input removed */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t('settings.accountType')}
                                            </label>
                                            <select
                                                value={bankAccount.accountType}
                                                onChange={(e) => setBankAccount({ ...bankAccount, accountType: e.target.value as 'Checking' | 'Savings' })}
                                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                            >
                                                <option value="Checking">{t('accountType.checking')}</option>
                                                <option value="Savings">{t('accountType.savings')}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t('settings.initialBalance')}
                                            </label>
                                            <CurrencyInput
                                                value={bankAccount.initialBalance}
                                                onChange={(val) => setBankAccount({ ...bankAccount, initialBalance: val })}
                                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('wizard.account.skip')}
                                </p>
                            </div>
                        )}

                        {/* Step 3: Categories */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t('wizard.categories.description')}
                                </p>

                                {/* Show existing categories */}
                                {expenseCategories.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            {t('settings.expenseCategories')}
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {expenseCategories.map((category, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-2 px-3 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
                                                >
                                                    {category}
                                                    <button
                                                        onClick={() => removeExpenseCategory(category)}
                                                        className="hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded p-0.5 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add new category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('settings.addCategory')}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && newCategory.trim()) {
                                                    addExpenseCategory(newCategory.trim());
                                                    setNewCategory('');
                                                }
                                            }}
                                            placeholder={t('settings.newCategoryPlaceholder')}
                                            className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                if (newCategory.trim()) {
                                                    addExpenseCategory(newCategory.trim());
                                                    setNewCategory('');
                                                }
                                            }}
                                            className="px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
                                        >
                                            {t('settings.addCategory')}
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('wizard.categories.skip')}
                                </p>
                            </div>
                        )}

                        {/* Step 4: Complete */}
                        {currentStep === 4 && (
                            <div className="text-center space-y-6 py-8">
                                <div className="flex justify-center">
                                    <Sparkles className="text-primary-600 animate-pulse" size={64} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        {t('wizard.complete.title')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {t('wizard.complete.description')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Fixed at Bottom (Thumb Zone) */}
                <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                    <div className="flex gap-3">
                        {currentStep > 0 && currentStep < steps.length - 1 && (
                            <button
                                onClick={handleBack}
                                className="flex-1 px-6 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
                            >
                                {t('wizard.button.back')}
                            </button>
                        )}
                        {currentStep > 0 && currentStep < steps.length - 1 && (
                            <button
                                onClick={handleSkip}
                                className="flex-1 px-6 py-4 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
                            >
                                {t('wizard.button.skip')}
                            </button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="flex-1 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-primary-600/30"
                            >
                                {currentStep === 0 ? t('wizard.button.next') : t('wizard.button.next')}
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                className="flex-1 px-6 py-4 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2"
                            >
                                <Check size={20} />
                                {t('wizard.complete.cta')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
