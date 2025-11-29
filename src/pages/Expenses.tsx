import { useState, useEffect } from 'react';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useRegion } from '../context/RegionContext';
import { formatCurrency } from '../utils/formatters';
import CurrencyInput from '../components/CurrencyInput';
import ConnectSheet from '../components/ConnectSheet';
import {
    getBanksByRegion,
    getBankById
} from '../data/banks';
import { Pencil, Trash2 } from 'lucide-react';
import type { Expense } from '../types/Expense';

export default function Expenses() {
    const { expenses, addExpense, spreadsheetId, fetchExpenses, isInitialized, deleteExpense } = useGoogleSheets();
    const { t } = useTranslation();
    const { region, currency, expenseCategories, bankAccounts, creditCards } = useRegion();
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newExpense, setNewExpense] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        type: 'Expense' as 'Income' | 'Expense',
        category: expenseCategories[0] || 'Food',
        method: 'Cash' as 'Cash' | 'Credit' | 'PIX' | 'Debit',
        creditCardId: '',
        bankAccountId: '',
    });
    const [creditCardFilter, setCreditCardFilter] = useState<string>('');

    // Filter expenses by credit card
    const filteredExpenses = creditCardFilter
        ? expenses.filter(e => e.creditCardId === creditCardFilter)
        : expenses;

    useEffect(() => {
        if (spreadsheetId && isInitialized) {
            fetchExpenses();
        }
    }, [spreadsheetId, isInitialized]);

    if (!spreadsheetId) {
        return <ConnectSheet />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const expenseToSave = {
                ...newExpense,
                type: 'Expense' as 'Income' | 'Expense',
                amount: newExpense.amount / 100
            };

            if (editingId) {
                console.log('Update not yet implemented');
            } else {
                await addExpense(expenseToSave);
            }

            setIsAdding(false);
            setEditingId(null);
            setNewExpense({
                date: new Date().toISOString().split('T')[0],
                description: '',
                amount: 0,
                type: 'Expense',
                category: expenseCategories[0] || 'Food',
                method: 'Cash',
                creditCardId: '',
                bankAccountId: '',
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
                await deleteExpense(id);
            } catch (err) {
                console.error('Failed to delete', err);
                setError('sheets.error.deleteFailed');
            }
        }
    };

    const handleEdit = (item: Expense) => {
        setNewExpense({
            date: item.date,
            description: item.description,
            amount: Math.round(item.amount * 100),
            type: 'Expense',
            category: item.category,
            method: item.method,
            creditCardId: item.creditCardId || '',
            bankAccountId: item.bankAccountId || '',
        });
        setEditingId(item.id);
        setIsAdding(true);
    };

    const handleCancelEdit = () => {
        setIsAdding(false);
        setEditingId(null);
        setNewExpense({
            date: new Date().toISOString().split('T')[0],
            description: '',
            amount: 0,
            type: 'Expense',
            category: expenseCategories[0] || 'Food',
            method: 'Cash',
            creditCardId: '',
            bankAccountId: '',
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('expenses.title')}</h1>
                <button
                    onClick={() => editingId ? handleCancelEdit() : setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                    {isAdding ? t('expenses.cancelButton') : t('expenses.addButton')}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                    {t(error as any)}
                </div>
            )}

            {/* Credit Card Filter */}
            {creditCards.length > 0 && (
                <div className="flex items-center gap-4">
                    <label htmlFor="creditCardFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {t('expenses.filterByCreditCard')}:
                    </label>
                    <select
                        id="creditCardFilter"
                        value={creditCardFilter}
                        onChange={(e) => setCreditCardFilter(e.target.value)}
                        className="h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                        aria-label={t('expenses.filterByCreditCard')}
                    >
                        <option value="">{t('expenses.allExpenses')}</option>
                        {creditCards.map((card) => (
                            <option key={card.id} value={card.id}>
                                {card.name}{card.lastFourDigits && ` •••• ${card.lastFourDigits}`}
                            </option>
                        ))}
                    </select>
                    {creditCardFilter && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {filteredExpenses.length} {t('expenses.results')}
                        </span>
                    )}
                </div>
            )}

            {isAdding && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                        {editingId ? 'Edit Expense' : t('expenses.formTitle')}
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
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('form.amount')}
                            </label>
                            <div id="amount-wrapper">
                                <CurrencyInput
                                    value={newExpense.amount}
                                    onChange={(val) => setNewExpense({ ...newExpense, amount: val })}
                                    required
                                    className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Row 2: Date, Category, Method */}
                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('form.date')}
                            </label>
                            <input
                                id="date"
                                type="date"
                                required
                                value={newExpense.date}
                                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('form.category')}
                            </label>
                            <select
                                id="category"
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                required
                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                {expenseCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('form.method')}
                            </label>
                            <select
                                id="method"
                                value={newExpense.method}
                                onChange={(e) => {
                                    const method = e.target.value as any;
                                    setNewExpense({
                                        ...newExpense,
                                        method,
                                        creditCardId: method === 'Credit' ? newExpense.creditCardId : ''
                                    });
                                }}
                                required
                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="Cash">{t('method.cash')}</option>
                                <option value="PIX">{t('method.pix')}</option>
                                <option value="Debit">{t('method.debit')}</option>
                                <option value="Credit">{t('method.credit')}</option>
                            </select>
                        </div>

                        {/* Row 3: Payment Details (Conditional) */}
                        {newExpense.method === 'Credit' && (
                            <div className="col-span-12 md:col-span-6">
                                <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    {t('form.creditCard')}
                                </label>
                                <select
                                    id="creditCard"
                                    value={newExpense.creditCardId}
                                    onChange={(e) => setNewExpense({ ...newExpense, creditCardId: e.target.value })}
                                    required
                                    className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="">{t('form.selectCreditCard')}</option>
                                    {creditCards.map((card) => (
                                        <option key={card.id} value={card.id}>
                                            {card.name}{card.lastFourDigits && ` •••• ${card.lastFourDigits}`}
                                        </option>
                                    ))}
                                </select>
                                {creditCards.length === 0 && (
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1" role="alert">
                                        {t('expenses.noCreditCards')}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className={`col-span-12 ${newExpense.method === 'Credit' ? 'md:col-span-6' : 'md:col-span-12'}`}>
                            <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('form.bankAccount')}
                            </label>
                            <select
                                id="bankAccount"
                                value={newExpense.bankAccountId}
                                onChange={(e) => setNewExpense({ ...newExpense, bankAccountId: e.target.value })}
                                className="w-full h-11 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="" className='hidden'>{t('form.selectBankAccount')}</option>
                                {bankAccounts
                                    .filter(account => {
                                        const regionBanks = getBanksByRegion(region);
                                        return regionBanks.some(b => b.id === account.bankName);
                                    })
                                    .map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {getBankById(account.bankName)?.name || account.bankName}
                                            {(account.agency || account.accountNumber) ? ` (${account.agency || ''}/${account.accountNumber || ''})` : ''}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="col-span-12 flex justify-end mt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 h-11"
                            >
                                {loading ? t('expenses.savingButton') : t('expenses.saveButton')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">{t('table.date')}</th>
                                <th className="px-6 py-3">{t('table.description')}</th>
                                <th className="px-6 py-3">{t('table.category')}</th>
                                <th className="px-6 py-3">{t('table.method')}</th>
                                <th className="px-6 py-3">{t('table.bankAccount')}</th>
                                <th className="px-6 py-3">{t('table.amount')}</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {t('dashboard.noTransactions')}
                                    </td>
                                </tr>
                            ) : (
                                filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{expense.date}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">{expense.description}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="px-2 py-1 rounded-full text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                                                {t(`method.${expense.method.toLowerCase()}` as any)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {expense.bankAccountId && (getBankById(bankAccounts.find(a => a.id === expense.bankAccountId)?.bankName || '')?.name || '-') || '-'}
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-bold ${expense.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {expense.type === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(expense.amount), currency, region)}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(expense)}
                                                className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(expense.id)}
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

                <div className="md:hidden">
                    {filteredExpenses.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            {t('dashboard.noTransactions')}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredExpenses.map((expense) => (
                                <div key={expense.id} className="p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{expense.date}</p>
                                            <p className="font-medium text-gray-800 dark:text-gray-100">{expense.description}</p>
                                        </div>
                                        <span className={`font-bold ${expense.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {expense.type === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(expense.amount), currency, region)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                            {expense.category}
                                        </span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(expense)}
                                                className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(expense.id)}
                                                className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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
