import { useState } from 'react';
import { useGoogleSheets, useRegion } from '@/context';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/hooks';
import { ConnectSheet } from '@/components';

export default function Home() {
    const { user, signIn, expenses, income, spreadsheetId, fetchExpenses, fetchIncome } = useGoogleSheets();
    const { region, currency } = useRegion();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const handleRefresh = async () => {
        setLoading(true);
        setError(null);
        try {
            await Promise.all([fetchExpenses(), fetchIncome()]);
        } catch {
            setError('Failed to refresh data');
        } finally {
            setLoading(false);
        }
    };

    const totalIncome = income.reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    const recentTransactions = [...income, ...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">{t('auth.welcome')}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    {t('auth.description')}
                </p>
                <button
                    onClick={() => signIn()}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                    {t('auth.signIn')}
                </button>
            </div>
        );
    }

    if (!spreadsheetId) {
        return <ConnectSheet />;
    }

    return (
        <div className="relative min-h-screen">
            {/* Refresh Spinner Indicator - Behind Content */}


            {/* Main Content - Draggable */}
            <div
                className="space-y-8 bg-gray-50 dark:bg-gray-900 relative z-10 min-h-screen"
            >
                <div className="flex justify-between items-center pt-1">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('dashboard.title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{t('dashboard.welcomeBack')}, {user.name}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="hidden md:block p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-full transition-colors"
                            title={t('dashboard.refreshData')}
                        >
                            <svg className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.totalIncome')}</h3>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{formatCurrency(totalIncome, currency, region)}</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.totalExpenses')}</h3>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{formatCurrency(totalExpense, currency, region)}</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.balance')}</h3>
                        <p className={`text-2xl font-bold mt-2 ${balance >= 0 ? 'text-gray-800 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}`}>
                            {formatCurrency(balance, currency, region)}
                        </p>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('dashboard.recentTransactions')}</h2>
                    </div>

                    {/* Desktop Table View */}
                    <div className="overflow-x-auto hidden md:block">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3">{t('table.date')}</th>
                                    <th className="px-6 py-3">{t('table.description')}</th>
                                    <th className="px-6 py-3">{t('table.category')}</th>
                                    <th className="px-6 py-3">{t('table.amount')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {recentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            {t('dashboard.noTransactions')}
                                        </td>
                                    </tr>
                                ) : (
                                    recentTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{transaction.date}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">{transaction.description}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-sm font-bold ${transaction.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {transaction.type === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount), currency, region)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden">
                        {recentTransactions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                {t('dashboard.noTransactions')}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                {recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="p-4 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-100">{transaction.description}</p>
                                            </div>
                                            <span className={`font-bold ${transaction.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {transaction.type === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount), currency, region)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                                {transaction.category}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
