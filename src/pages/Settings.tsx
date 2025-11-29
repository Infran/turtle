import { useState, useEffect } from 'react';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useRegion } from '../context/RegionContext';
import { useLayoutConfig } from '../context/LayoutContext';
import { Trash2, Landmark, FileSpreadsheet, Settings as SettingsIcon, Globe, Menu, Plus, X, CheckCircle, AlertCircle, ChevronRight, Save, Smartphone, Palette } from 'lucide-react';
import CurrencyInput from '../components/CurrencyInput';
import { getBanksByRegion, getBankById } from '../data/banks';
import BankDetailsModal from '../components/BankDetailsModal';
import type { BankAccount } from '../types/BankAccount';

type Section = 'spreadsheets' | 'accounts' | 'categories' | 'preferences';

export default function Settings() {
    const { spreadsheetId, setSpreadsheetId, incomeSheetId, setIncomeSheetId, repairSheetStructure } = useGoogleSheets();
    const { t } = useTranslation();
    const {
        region,
        setRegion,
        currency,
        setCurrency,
        incomeCategories,
        expenseCategories,
        addIncomeCategory,
        removeIncomeCategory,
        addExpenseCategory,
        removeExpenseCategory,
        bankAccounts,
        creditCards,
        addBankAccount,
        removeBankAccount,
        updateBankAccount
    } = useRegion();
    const { mobileLayoutMode, setMobileLayoutMode, mobileStyle, setMobileStyle } = useLayoutConfig();

    const [activeSection, setActiveSection] = useState<Section>('spreadsheets');
    const [inputSheetId, setInputSheetId] = useState(spreadsheetId || '');
    const [inputIncomeSheetId, setInputIncomeSheetId] = useState(incomeSheetId || '');
    const [isSaved, setIsSaved] = useState(false);
    const [newIncomeCategory, setNewIncomeCategory] = useState('');
    const [newExpenseCategory, setNewExpenseCategory] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

    // Bank Account state
    const [newBankAccount, setNewBankAccount] = useState({
        bankName: '', // Stores Bank ID
        accountType: 'Checking' as 'Checking' | 'Savings',
        agency: '',
        accountNumber: '',
        initialBalance: 0
    });

    // Update inputs if context values change (e.g. after a disconnect or external update)
    // Update inputs if context values change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputSheetId(spreadsheetId || '');
        setInputIncomeSheetId(incomeSheetId || '');
    }, [spreadsheetId, incomeSheetId]);

    const handleSaveExpenseSheet = () => {
        if (inputSheetId) {
            setSpreadsheetId(inputSheetId);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }
    };

    const handleSaveIncomeSheet = () => {
        if (inputIncomeSheetId) {
            setIncomeSheetId(inputIncomeSheetId);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }
    };

    const handleDisconnectExpenseSheet = () => {
        setSpreadsheetId('');
        setInputSheetId('');
    };

    const handleDisconnectIncomeSheet = () => {
        setIncomeSheetId('');
        setInputIncomeSheetId('');
    };

    const handleAddIncomeCategory = () => {
        if (newIncomeCategory.trim()) {
            addIncomeCategory(newIncomeCategory.trim());
            setNewIncomeCategory('');
        }
    };

    const handleAddExpenseCategory = () => {
        if (newExpenseCategory.trim()) {
            addExpenseCategory(newExpenseCategory.trim());
            setNewExpenseCategory('');
        }
    };

    const handleAddBankAccount = () => {
        if (newBankAccount.bankName.trim()) {
            addBankAccount({
                ...newBankAccount,
                initialBalance: newBankAccount.initialBalance / 100
            });
            setNewBankAccount({
                bankName: '',
                accountType: 'Checking',
                agency: '',
                accountNumber: '',
                initialBalance: 0
            });
        }
    };

    const sections: { id: Section; icon: typeof FileSpreadsheet; labelKey: string; descriptionKey: string }[] = [
        { id: 'spreadsheets', icon: FileSpreadsheet, labelKey: 'settings.section.spreadsheets', descriptionKey: 'settings.section.spreadsheetsDesc' },
        { id: 'accounts', icon: Landmark, labelKey: 'settings.section.accounts', descriptionKey: 'settings.section.accountsDesc' },
        { id: 'categories', icon: SettingsIcon, labelKey: 'settings.section.categories', descriptionKey: 'settings.section.categoriesDesc' },
        { id: 'preferences', icon: Globe, labelKey: 'settings.section.preferences', descriptionKey: 'settings.section.preferencesDesc' },
    ];

    // Logic for Mobile Layout:
    const useMobileBottomTabs = mobileLayoutMode === 'drawer';
    const useMobileSidebar = mobileLayoutMode === 'bottom';

    // Logic for Desktop Layout:
    const useDesktopHeader = false;
    const useDesktopSidebar = true;

    // Helper component for Sidebar Items
    const SettingsSidebarItem = ({ id, icon: Icon, labelKey }: { id: Section, icon: React.ElementType, labelKey: string }) => (
        <button
            onClick={() => {
                setActiveSection(id);
                setIsSidebarOpen(false);
            }}
            className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out w-full mb-1
                ${activeSection === id
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }
            `}
        >
            <span className={`shrink-0 transition-colors ${activeSection === id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
                <Icon size={20} />
            </span>
            <span className="ml-3 whitespace-nowrap">{t(labelKey as import('../i18n/translations').TranslationKey)}</span>
            {activeSection === id && (
                <ChevronRight className="ml-auto w-4 h-4 text-primary-500 dark:text-primary-400" />
            )}
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
            {/* --- Navigation: Sidebar (Desktop & Mobile) --- */}
            <aside className={`
                fixed z-50 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                
                /* Mobile: Bottom Sheet */
                inset-x-0 bottom-0 w-full rounded-t-2xl border-t border-gray-200 dark:border-gray-700
                ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full'}
                
                /* Desktop: Left Sidebar (Resetting mobile styles) */
                md:inset-y-0 md:left-0 md:bottom-auto md:w-64 md:rounded-none md:border-t-0 md:border-r md:z-40
                
                /* Desktop Visibility/State */
                ${useDesktopSidebar ? 'md:translate-y-0 md:translate-x-0 md:static' : 'md:hidden'}
                
                /* Mobile Visibility */
                ${useMobileSidebar ? 'block' : 'hidden md:block'} 
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-none">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
                            <SettingsIcon className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">{t('settings.title')}</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-h-[70vh] md:max-h-full">
                    {sections.map((section) => (
                        <SettingsSidebarItem key={section.id} {...section} />
                    ))}
                </nav>
            </aside>

            {/* --- Mobile Overlay --- */}
            {useMobileSidebar && isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- Main Content Area --- */}
            <div className="flex-1 flex flex-col mx-auto my-auto min-w-0 max-w-7xl min-h-0 max-h-7xl overflow-hidden relative">

                {/* --- Navigation: Header (Desktop Only) --- */}
                {useDesktopHeader && (
                    <header className="hidden md:block h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0 z-20">
                        <div className="max-w-7xl mx-auto px-4 h-full flex items-center relative">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                                    <SettingsIcon size={20} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-800 dark:text-white">{t('settings.title')}</h1>
                            </div>
                            <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-1 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
                                {sections.map(({ id, icon: Icon, labelKey }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveSection(id)}
                                        className={`
                                            flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                                            ${activeSection === id
                                                ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        <span>{t(labelKey as import('../i18n/translations').TranslationKey)}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </header>
                )}

                {/* --- Scrollable Content --- */}
                <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-5xl max-h-5xl my-auto mx-auto w-full space-y-8 pb-24 md:pb-8">

                        {/* Mobile Header Title */}
                        <div className="md:hidden flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {t('settings.title')}
                            </h1>
                        </div>

                        {/* --- Content Sections --- */}
                        {activeSection === 'spreadsheets' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.expenseSheet')}</h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.expenseSheetDesc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="font-medium">Status:</span>
                                                {spreadsheetId ? (
                                                    <span className="flex items-center text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full text-xs">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> {t('common.connected')}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                                                        <AlertCircle className="w-3 h-3 mr-1" /> {t('common.disconnected')}
                                                    </span>
                                                )}
                                            </div>
                                            {spreadsheetId && (
                                                <div className="flex space-x-3">
                                                    <button onClick={repairSheetStructure} className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline">
                                                        {t('settings.repairStructure')}
                                                    </button>
                                                    <button onClick={handleDisconnectExpenseSheet} className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:underline">
                                                        {t('common.disconnect')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                {t('settings.sheetId')}
                                            </label>
                                            <div className="flex gap-3">
                                                <input
                                                    id="expenseSheetId"
                                                    type="text"
                                                    value={inputSheetId}
                                                    onChange={(e) => setInputSheetId(e.target.value)}
                                                    placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                                                    className="flex-1 h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                                />
                                                <button
                                                    onClick={handleSaveExpenseSheet}
                                                    disabled={!inputSheetId || inputSheetId === spreadsheetId}
                                                    className="inline-flex items-center px-4 p-2 h-11 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                    title={t('common.save')}
                                                >
                                                    {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <FileSpreadsheet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.incomeSheet')}</h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.incomeSheetDesc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="font-medium">Status:</span>
                                                {incomeSheetId ? (
                                                    <span className="flex items-center text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full text-xs">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> {t('common.connected')}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                                                        <AlertCircle className="w-3 h-3 mr-1" /> {t('common.disconnected')}
                                                    </span>
                                                )}
                                            </div>
                                            {incomeSheetId && (
                                                <button onClick={handleDisconnectIncomeSheet} className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:underline">
                                                    {t('common.disconnect')}
                                                </button>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                {t('settings.sheetId')}
                                            </label>
                                            <div className="flex gap-3">
                                                <input
                                                    id="incomeSheetId"
                                                    type="text"
                                                    value={inputIncomeSheetId}
                                                    onChange={(e) => setInputIncomeSheetId(e.target.value)}
                                                    placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                                                    className="flex-1 h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                                />
                                                <button
                                                    onClick={handleSaveIncomeSheet}
                                                    disabled={!inputIncomeSheetId || inputIncomeSheetId === incomeSheetId}
                                                    className="inline-flex items-center px-4 p-2 h-11 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                    title={t('common.save')}
                                                >
                                                    {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'accounts' && (
                            <div className="space-y-8 animate-fadeIn">
                                {/* Bank Accounts */}
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                <Landmark className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.bankAccounts')}</h2>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6 animate-fadeIn">
                                        {bankAccounts.map((account, index) => {
                                            const bank = getBankById(account.bankName);
                                            const bgColor = bank?.color || '#ffffff';
                                            const textColor = bank?.textColor || '#1f2937';
                                            const linkedCards = creditCards.filter(c => c.bankAccountId === account.id);

                                            return (
                                                <div
                                                    key={account.id}
                                                    onClick={() => setSelectedAccount(account)}
                                                    className="group relative p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all animate-fadeIn cursor-pointer hover:scale-[1.02]"
                                                    style={{
                                                        backgroundColor: bgColor,
                                                        animationDelay: `${index * 100}ms`
                                                    }}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm bg-white/20 backdrop-blur-sm" style={{ color: textColor }}>
                                                            <Landmark size={20} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-sm truncate" style={{ color: textColor }}>{bank?.name || account.bankName}</h3>
                                                            <div className="text-xs opacity-90 flex flex-col" style={{ color: textColor }}>
                                                                <span className="truncate">{account.accountType}</span>
                                                                {(account.agency || account.accountNumber) && (
                                                                    <span className="font-mono mt-0.5 truncate">
                                                                        {account.agency && `${account.agency} / `}
                                                                        {account.accountNumber}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Linked Cards Indicator */}
                                                    {linkedCards.length > 0 && (
                                                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold" style={{ color: textColor }}>
                                                            {linkedCards.length}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Add New Bank Account Card */}
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 grid grid-cols-12 gap-4">
                                        <h3 className="col-span-12 text-sm font-medium text-gray-900 dark:text-white text-center mb-2">{t('settings.addAccount')}</h3>
                                        <div className="col-span-12 md:col-span-4">
                                            <input
                                                id="newAccountAgency"
                                                type="text"
                                                value={newBankAccount.agency}
                                                onChange={(e) => setNewBankAccount({ ...newBankAccount, agency: e.target.value })}
                                                placeholder={t('settings.agency')}
                                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                            />
                                        </div>
                                        <div className="col-span-12 md:col-span-4">
                                            <input
                                                id="newAccountNumber"
                                                type="text"
                                                value={newBankAccount.accountNumber}
                                                onChange={(e) => setNewBankAccount({ ...newBankAccount, accountNumber: e.target.value })}
                                                placeholder={t('settings.accountNumber')}
                                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                            />
                                        </div>
                                        <div className="col-span-12 md:col-span-4">
                                            <select
                                                id="newAccountBank"
                                                value={newBankAccount.bankName}
                                                onChange={(e) => setNewBankAccount({ ...newBankAccount, bankName: e.target.value })}
                                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                            >
                                                <option value="">{t('settings.selectBank')}</option>
                                                {getBanksByRegion(region).map(bank => (
                                                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-12">
                                            <CurrencyInput
                                                value={newBankAccount.initialBalance}
                                                onChange={(value) => setNewBankAccount({ ...newBankAccount, initialBalance: value })}
                                                placeholder={t('settings.initialBalance')}
                                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                            />
                                        </div>
                                        <div className="col-span-12">
                                            <button
                                                onClick={handleAddBankAccount}
                                                disabled={!newBankAccount.bankName}
                                                className="w-full h-11 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={16} className="mr-2" /> {t('common.add')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bank Details Modal */}
                                    {selectedAccount && (
                                        <BankDetailsModal
                                            account={selectedAccount}
                                            onClose={() => setSelectedAccount(null)}
                                            onSave={updateBankAccount}
                                            onDelete={() => {
                                                removeBankAccount(selectedAccount.id);
                                                setSelectedAccount(null);
                                            }}
                                        />
                                    )}
                                </section>
                            </div>
                        )}

                        {activeSection === 'categories' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                                {/* Income Categories */}
                                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('settings.incomeCategories')}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.incomeCategoriesDesc')}</p>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex gap-2 mb-4">
                                            <input
                                                id="newIncomeCategory"
                                                type="text"
                                                value={newIncomeCategory}
                                                onChange={(e) => setNewIncomeCategory(e.target.value)}
                                                placeholder={t('settings.newCategory')}
                                                className="flex-1 h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddIncomeCategory()}
                                            />
                                            <button
                                                onClick={handleAddIncomeCategory}
                                                disabled={!newIncomeCategory.trim()}
                                                className="inline-flex items-center px-3 py-2 h-11 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2">
                                            {incomeCategories.map((category) => (
                                                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                                                    <button
                                                        onClick={() => removeIncomeCategory(category)}
                                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Expense Categories */}
                                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('settings.expenseCategories')}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.expenseCategoriesDesc')}</p>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex gap-2 mb-4">
                                            <input
                                                id="newExpenseCategory"
                                                type="text"
                                                value={newExpenseCategory}
                                                onChange={(e) => setNewExpenseCategory(e.target.value)}
                                                placeholder={t('settings.newCategory')}
                                                className="flex-1 h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddExpenseCategory()}
                                            />
                                            <button
                                                onClick={handleAddExpenseCategory}
                                                disabled={!newExpenseCategory.trim()}
                                                className="inline-flex items-center px-3 py-2 h-11 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2">
                                            {expenseCategories.map((category) => (
                                                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                                                    <button
                                                        onClick={() => removeExpenseCategory(category)}
                                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeSection === 'preferences' && (
                            <div className="space-y-6 animate-fadeIn">
                                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                                    <div className="flex items-center space-x-3 mb-8">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.regionalSettings')}</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.regionalSettingsDesc')}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {t('settings.region')}
                                            </label>
                                            <select
                                                id="region"
                                                value={region}
                                                onChange={(e) => setRegion(e.target.value as 'BR' | 'US')}
                                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                            >
                                                <option value="BR">Brasil (PT-BR)</option>
                                                <option value="US">United States (EN-US)</option>
                                            </select>
                                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                Defines formatting for dates and numbers.
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {t('settings.currency')}
                                            </label>
                                            <select
                                                id="currency"
                                                value={currency}
                                                onChange={(e) => setCurrency(e.target.value as import('../context/RegionContext').Currency)}
                                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                            >
                                                <option value="BRL">Real (BRL)</option>
                                                <option value="USD">Dollar (USD)</option>
                                                <option value="EUR">Euro (EUR)</option>
                                            </select>
                                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                Used for display purposes only.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Mobile Layout Mode */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <Smartphone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {t('settings.mobileLayout')}
                                            </label>
                                        </div>
                                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                            <button
                                                onClick={() => setMobileLayoutMode('drawer')}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mobileLayoutMode === 'drawer'
                                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                                    }`}
                                            >
                                                Drawer
                                            </button>
                                            <button
                                                onClick={() => setMobileLayoutMode('bottom')}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mobileLayoutMode === 'bottom'
                                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                                    }`}
                                            >
                                                Bottom Nav
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Choose between a side drawer or a bottom navigation bar for mobile devices.
                                    </p>
                                </div>

                                {/* Mobile Style Selector */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <Palette className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Mobile Style
                                            </label>
                                        </div>
                                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                            <button
                                                onClick={() => setMobileStyle('apple')}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mobileStyle === 'apple'
                                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                                    }`}
                                            >
                                                Apple
                                            </button>
                                            <button
                                                onClick={() => setMobileStyle('android')}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mobileStyle === 'android'
                                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                                    }`}
                                            >
                                                Android
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Choose the visual style for mobile navigation and menus.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Tab Navigation - Only if useMobileBottomTabs is true */}
            {useMobileBottomTabs && (
                <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl z-50">
                    <div className="flex justify-around items-center h-16">
                        {sections.map(({ id, icon: Icon, labelKey }) => (
                            <button
                                key={id}
                                onClick={() => setActiveSection(id)}
                                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 rounded-xl ${activeSection === id
                                    ? 'text-primary-600 dark:text-primary-400 scale-110'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="text-[10px] mt-1 font-medium">{t(labelKey as import('../i18n/translations').TranslationKey)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Menu Button for Mobile Sidebar Mode */}
            {useMobileSidebar && (
                <>
                    {/* Floating Action Button */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg shadow-primary-600/30 flex items-center justify-center z-40 transition-transform active:scale-95 backdrop-blur-sm"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Bottom Sheet Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        onClick={() => setIsSidebarOpen(false)}
                    />

                    {/* Bottom Sheet Content */}
                    <div
                        className={`fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl z-50 transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-y-0' : 'translate-y-[120%]'
                            }`}
                    >
                        <div className="p-4">
                            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />
                            <div className="grid grid-cols-4 gap-4">
                                {sections.map(({ id, icon: Icon, labelKey }) => (
                                    <button
                                        key={id}
                                        onClick={() => {
                                            setActiveSection(id);
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeSection === id
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-xl mb-2 ${activeSection === id ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                            <Icon size={24} />
                                        </div>
                                        <span className="text-xs font-medium text-center">{t(labelKey as import('../i18n/translations').TranslationKey)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
