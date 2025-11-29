import { useState, useEffect } from 'react';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useRegion } from '../context/RegionContext';
import { formatCurrency } from '../utils/formatters';
import CurrencyInput from '../components/CurrencyInput';
import { Pencil, Trash2 } from 'lucide-react';
import type { Expense } from '../types/Expense';

export default function Incomes() {
    const { income, addIncome, incomeSheetId, fetchIncome, isInitialized, deleteIncome } = useGoogleSheets();
    const { t } = useTranslation();
    const { region, currency, incomeCategories } = useRegion();
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newIncome, setNewIncome] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0, // Now in cents
        type: 'Income' as 'Income' | 'Expense',
        category: incomeCategories[0] || 'Salary',
    });

    // Fetch income data on mount
    useEffect(() => {
        if (incomeSheetId && isInitialized) {
            fetchIncome();
        }
    }, [incomeSheetId, isInitialized]);

    // If no spreadsheet is connected, show the connect prompt
    if (!incomeSheetId) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t('incomes.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t('sheets.error.noSpreadsheet')}</p>
                <a href="/settings" className="text-primary-600 hover:underline">{t('menu.settings')}</a>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Convert cents to dollar amount for storage
            const incomeToSave = {
                ...newIncome,
                type: 'Income' as 'Income' | 'Expense', // Hardcode type
                amount: newIncome.amount / 100,
                method: 'Cash' as 'Cash' | 'Credit' | 'PIX' | 'Debit'
            };

            if (editingId) {
                // TODO: Implement update logic
                console.log('Update not yet implemented');
            } else {
                await addIncome(incomeToSave);
            }

            setIsAdding(false);
            setEditingId(null);
            setNewIncome({
                date: new Date().toISOString().split('T')[0],
                description: '',
                amount: 0,
                type: 'Income',
                category: incomeCategories[0] || 'Salary',
            });
        } catch (err) {
            console.error(err);
            setError('sheets.error.addFailed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('common.confirmDelete'))) {
            try {
                await deleteIncome(id);
            } catch (err) {
                console.error('Failed to delete', err);
                setError('sheets.error.deleteFailed');
            }
        }
    };

    const handleEdit = (item: Expense) => {
        setNewIncome({
            date: item.date,
            description: item.description,
            amount: Math.round(item.amount * 100), // Convert to cents
            type: 'Income',
            category: item.category,
        });
        setEditingId(item.id);
        setIsAdding(true);
    };

    const handleCancelEdit = () => {
        setIsAdding(false);
        setEditingId(null);
        setNewIncome({
            date: new Date().toISOString().split('T')[0],
            description: '',
            amount: 0,
            type: 'Income',
            category: incomeCategories[0] || 'Salary',
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('incomes.title')}</h1>
                <button
                    onClick={() => editingId ? handleCancelEdit() : setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                    {isAdding ? t('incomes.cancelButton') : t('incomes.addButton')}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                    {t(error as any)}
                </div>
            )}

            {isAdding && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                        {editingId ? 'Edit Income' : t('incomes.formTitle')}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
                        {/* Row 1: Description and Amount */}
                        <div className="col-span-12 md:col-span-8">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('form.description')}
                            </label>
                            <input
                                id="description"
                                type="text"
                                required
                                placeholder={t('form.descriptionPlaceholder')}
                                value={newIncome.description}
                                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('form.amount')}
                            </label>
                            <div id="amount-wrapper">
                                <CurrencyInput
                                    value={newIncome.amount}
                                    onChange={(val) => setNewIncome({ ...newIncome, amount: val })}
                                    required
                                    className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Row 2: Date and Category */}
                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('form.date')}
                            </label>
                            <input
                                id="date"
                                type="date"
                                required
                                value={newIncome.date}
                                onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('form.category')}
                            </label>
                            <select
                                id="category"
                                value={newIncome.category}
                                onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
                                required
                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                {incomeCategories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50">{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-12 flex justify-end mt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 h-11"
                            >
                                {loading ? t('incomes.savingButton') : t('incomes.saveButton')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Desktop Table View */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">{t('table.date')}</th>
                                <th className="px-6 py-3">{t('table.description')}</th>
                                <th className="px-6 py-3">{t('table.category')}</th>
                                <th className="px-6 py-3">{t('table.amount')}</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {income.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {t('dashboard.noTransactions')}
                                    </td>
                                </tr>
                            ) : (
                                income.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.date}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">{item.description}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-green-600 dark:text-green-400">
                                            +{formatCurrency(Math.abs(item.amount), currency, region)}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                    {income.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            {t('dashboard.noTransactions')}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {income.map((item) => (
                                <div key={item.id} className="p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                                            <p className="font-medium text-gray-800 dark:text-gray-100">{item.description}</p>
                                        </div>
                                        <span className="font-bold text-green-600 dark:text-green-400">
                                            +{formatCurrency(Math.abs(item.amount), currency, region)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                            {item.category}
                                        </span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
