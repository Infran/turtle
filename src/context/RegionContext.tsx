import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Locale } from '../i18n/translations';
import type { BankAccount } from '../types/BankAccount';
import type { CreditCard } from '../types/CreditCard';

export type Region = 'US' | 'BR';
export type Currency = 'BRL' | 'USD';

interface RegionContextType {
    region: Region;
    setRegion: (region: Region) => void;
    toggleRegion: () => void;
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    incomeCategories: string[];
    expenseCategories: string[];
    addIncomeCategory: (category: string) => void;
    removeIncomeCategory: (category: string) => void;
    addExpenseCategory: (category: string) => void;
    removeExpenseCategory: (category: string) => void;
    bankAccounts: BankAccount[];
    creditCards: CreditCard[];
    addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
    updateBankAccount: (account: BankAccount) => void;
    removeBankAccount: (id: string) => void;
    addCreditCard: (card: Omit<CreditCard, 'id'>) => void;
    removeCreditCard: (id: string) => void;
    hasConfiguredPreferences: boolean;
    setPreferencesConfigured: () => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

// Helper to get translated default categories
const getDefaultIncomeCategories = (region: Region): string[] => {
    const locale: Locale = region === 'US' ? 'en-US' : 'pt-BR';
    const t = translations[locale] as any;
    return [
        t['category.income.salary'],
        t['category.income.freelance'],
        t['category.income.investments'],
        t['category.income.gifts'],
        t['category.income.other'],
    ];
};

const getDefaultExpenseCategories = (region: Region): string[] => {
    const locale: Locale = region === 'US' ? 'en-US' : 'pt-BR';
    const t = translations[locale] as any;
    return [
        t['category.expense.food'],
        t['category.expense.transport'],
        t['category.expense.housing'],
        t['category.expense.entertainment'],
        t['category.expense.healthcare'],
        t['category.expense.other'],
    ];
};

export const RegionProvider = ({ children }: { children: ReactNode }) => {
    const [region, setRegionState] = useState<Region>(() => {
        const savedRegion = localStorage.getItem('region');
        return (savedRegion === 'US' || savedRegion === 'BR') ? savedRegion : 'BR';
    });

    const [currency, setCurrencyState] = useState<Currency>(() => {
        const savedCurrency = localStorage.getItem('currency');
        return (savedCurrency === 'BRL' || savedCurrency === 'USD')
            ? savedCurrency
            : 'BRL'; // Default to BRL
    });

    const [incomeCategories, setIncomeCategories] = useState<string[]>(() => {
        const saved = localStorage.getItem('incomeCategories');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize with translated defaults based on current region
        return getDefaultIncomeCategories(
            (localStorage.getItem('region') === 'US' || localStorage.getItem('region') === 'BR')
                ? localStorage.getItem('region') as Region
                : 'BR'
        );
    });

    const [expenseCategories, setExpenseCategories] = useState<string[]>(() => {
        const saved = localStorage.getItem('expenseCategories');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize with translated defaults based on current region
        return getDefaultExpenseCategories(
            (localStorage.getItem('region') === 'US' || localStorage.getItem('region') === 'BR')
                ? localStorage.getItem('region') as Region
                : 'BR'
        );
    });

    const [hasConfiguredPreferences, setHasConfiguredPreferences] = useState<boolean>(() => {
        const configured = localStorage.getItem('hasConfiguredPreferences');
        return configured === 'true';
    });

    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
        const saved = localStorage.getItem('bankAccounts');
        return saved ? JSON.parse(saved) : [];
    });

    const [creditCards, setCreditCards] = useState<CreditCard[]>(() => {
        const saved = localStorage.getItem('creditCards');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('region', region);
    }, [region]);

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    useEffect(() => {
        localStorage.setItem('incomeCategories', JSON.stringify(incomeCategories));
    }, [incomeCategories]);

    useEffect(() => {
        localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories));
    }, [expenseCategories]);

    useEffect(() => {
        localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));
    }, [bankAccounts]);

    useEffect(() => {
        localStorage.setItem('creditCards', JSON.stringify(creditCards));
    }, [creditCards]);

    // Update default categories when region/language changes
    useEffect(() => {
        // Get all possible default categories (both languages)
        const defaultsEN = {
            expense: getDefaultExpenseCategories('US'),
            income: getDefaultIncomeCategories('US')
        };
        const defaultsPT = {
            expense: getDefaultExpenseCategories('BR'),
            income: getDefaultIncomeCategories('BR')
        };

        // Check if current expense categories are defaults (either language)
        const expenseIsDefault =
            expenseCategories.every(cat => defaultsEN.expense.includes(cat)) ||
            expenseCategories.every(cat => defaultsPT.expense.includes(cat));

        // Check if current income categories are defaults (either language)
        const incomeIsDefault =
            incomeCategories.every(cat => defaultsEN.income.includes(cat)) ||
            incomeCategories.every(cat => defaultsPT.income.includes(cat));

        // Update to current language's defaults if they haven't been customized
        if (expenseIsDefault && expenseCategories.length === 6) {
            const newDefaults = getDefaultExpenseCategories(region);
            // Only update if actually different (avoid infinite loop)
            if (JSON.stringify(expenseCategories) !== JSON.stringify(newDefaults)) {
                setExpenseCategories(newDefaults);
            }
        }

        if (incomeIsDefault && incomeCategories.length === 5) {
            const newDefaults = getDefaultIncomeCategories(region);
            // Only update if actually different (avoid infinite loop)
            if (JSON.stringify(incomeCategories) !== JSON.stringify(newDefaults)) {
                setIncomeCategories(newDefaults);
            }
        }
    }, [region]); // Only run when region changes


    const setRegion = (newRegion: Region) => {
        setRegionState(newRegion);
    };

    const toggleRegion = () => {
        setRegionState(prev => prev === 'US' ? 'BR' : 'US');
    };

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
    };

    const addIncomeCategory = (category: string) => {
        if (category && !incomeCategories.includes(category)) {
            setIncomeCategories([...incomeCategories, category]);
        }
    };

    const removeIncomeCategory = (category: string) => {
        setIncomeCategories(incomeCategories.filter(c => c !== category));
    };

    const addExpenseCategory = (category: string) => {
        if (category && !expenseCategories.includes(category)) {
            setExpenseCategories([...expenseCategories, category]);
        }
    };

    const removeExpenseCategory = (category: string) => {
        setExpenseCategories(expenseCategories.filter(c => c !== category));
    };

    const setPreferencesConfigured = () => {
        setHasConfiguredPreferences(true);
        localStorage.setItem('hasConfiguredPreferences', 'true');
    };

    const addBankAccount = (account: Omit<BankAccount, 'id'>) => {
        const newAccount: BankAccount = {
            ...account,
            id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        setBankAccounts([...bankAccounts, newAccount]);
    };

    const updateBankAccount = (updatedAccount: BankAccount) => {
        setBankAccounts(bankAccounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
    };

    const removeBankAccount = (id: string) => {
        // Also remove any credit cards linked to this account
        setCreditCards(creditCards.filter(card => card.bankAccountId !== id));
        setBankAccounts(bankAccounts.filter(account => account.id !== id));
    };

    const addCreditCard = (card: Omit<CreditCard, 'id'>) => {
        const newCard: CreditCard = {
            ...card,
            id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        setCreditCards([...creditCards, newCard]);
    };

    const removeCreditCard = (id: string) => {
        setCreditCards(creditCards.filter(card => card.id !== id));
    };

    return (
        <RegionContext.Provider value={{
            region,
            setRegion,
            toggleRegion,
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
            updateBankAccount,
            removeBankAccount,
            addCreditCard,
            removeCreditCard,
            hasConfiguredPreferences,
            setPreferencesConfigured
        }}>
            {children}
        </RegionContext.Provider>
    );
};

export const useRegion = () => {
    const context = useContext(RegionContext);
    if (context === undefined) {
        throw new Error('useRegion must be used within a RegionProvider');
    }
    return context;
};
