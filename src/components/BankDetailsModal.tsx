import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useRegion } from '../context/RegionContext';
import { X, Plus, Trash2, CreditCard as CreditCardIcon, Save, Landmark } from 'lucide-react';
import type { BankAccount } from '../types/BankAccount';
import type { CreditCard } from '../types/CreditCard';
import { getBankById } from '../data/banks';

interface BankDetailsModalProps {
    account: BankAccount;
    onClose: () => void;
    onSave: (account: BankAccount) => void;
    onDelete: () => void;
}

export default function BankDetailsModal({ account, onClose, onSave, onDelete }: BankDetailsModalProps) {
    const { t } = useTranslation();
    const { creditCards, addCreditCard, removeCreditCard } = useRegion();
    const bank = getBankById(account.bankName);

    const [editedAccount, setEditedAccount] = useState<BankAccount>({ ...account });
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCard, setNewCard] = useState({
        name: '',
        lastFourDigits: ''
    });

    const accountCreditCards: CreditCard[] = creditCards.filter(card => card.bankAccountId === account.id);

    const handleSaveAccount = () => {
        onSave(editedAccount);
        onClose();
    };

    const handleAddCard = () => {
        if (newCard.name.trim()) {
            addCreditCard({
                ...newCard,
                bankAccountId: account.id
            });
            setNewCard({ name: '', lastFourDigits: '' });
            setIsAddingCard(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: bank?.color || '#gray-200', color: bank?.textColor || '#000' }}
                        >
                            <Landmark size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{bank?.name || account.bankName}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.bankAccounts')}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-8">

                    {/* Account Details Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <Landmark size={16} className="text-primary-500" />
                            {t('settings.section.accounts')}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                    {t('settings.agency')}
                                </label>
                                <input
                                    type="text"
                                    value={editedAccount.agency || ''}
                                    onChange={(e) => setEditedAccount({ ...editedAccount, agency: e.target.value })}
                                    className="w-full p-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="0000"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                    {t('settings.accountNumber')}
                                </label>
                                <input
                                    type="text"
                                    value={editedAccount.accountNumber || ''}
                                    onChange={(e) => setEditedAccount({ ...editedAccount, accountNumber: e.target.value })}
                                    className="w-full p-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="00000-0"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                    {t('settings.accountType')}
                                </label>
                                <select
                                    value={editedAccount.accountType}
                                    onChange={(e) => setEditedAccount({ ...editedAccount, accountType: e.target.value as 'Checking' | 'Savings' })}
                                    className="w-full p-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                >
                                    <option value="Checking">{t('accountType.checking')}</option>
                                    <option value="Savings">{t('accountType.savings')}</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Credit Cards Section */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <CreditCardIcon size={16} className="text-indigo-500" />
                                {t('settings.creditCards')}
                            </h3>
                            {!isAddingCard && (
                                <button
                                    onClick={() => setIsAddingCard(true)}
                                    className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 hover:underline"
                                >
                                    <Plus size={14} />
                                    {t('common.add')}
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {/* List Existing Cards */}
                            {accountCreditCards.length === 0 && !isAddingCard && (
                                <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('expenses.noCreditCards')}</p>
                                </div>
                            )}

                            {accountCreditCards.map(card => (
                                <div key={card.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <CreditCardIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{card.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">•••• {card.lastFourDigits}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeCreditCard(card.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            {/* Add New Card Form */}
                            {isAddingCard && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-primary-200 dark:border-primary-900/30 space-y-3 animate-fadeIn">
                                    <div>
                                        <input
                                            type="text"
                                            value={newCard.name}
                                            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                                            placeholder={t('settings.cardNamePlaceholder')}
                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 outline-none focus:border-primary-500"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newCard.lastFourDigits}
                                            onChange={(e) => setNewCard({ ...newCard, lastFourDigits: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                            placeholder={t('settings.last4')}
                                            maxLength={4}
                                            className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 outline-none focus:border-primary-500"
                                        />
                                        <button
                                            onClick={handleAddCard}
                                            disabled={!newCard.name}
                                            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
                                        >
                                            {t('common.add')}
                                        </button>
                                        <button
                                            onClick={() => setIsAddingCard(false)}
                                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                                        >
                                            {t('incomes.cancelButton')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between gap-4">
                    <button
                        onClick={() => {
                            if (window.confirm(t('common.confirmDelete'))) {
                                onDelete();
                                onClose();
                            }
                        }}
                        className="px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={18} />
                        {t('common.delete')}
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
                        >
                            {t('incomes.cancelButton')}
                        </button>
                        <button
                            onClick={handleSaveAccount}
                            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-primary-600/20"
                        >
                            <Save size={18} />
                            {t('common.save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
