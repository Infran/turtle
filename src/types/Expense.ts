export type ExpenseType = 'Income' | 'Expense';
export type PaymentMethod = 'Cash' | 'PIX' | 'Debit' | 'Credit';

export interface Expense {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: ExpenseType;
    category: string;
    method: PaymentMethod;
    creditCardId?: string; // Only populated when method is 'Credit' - references a registered credit card
    bankAccountId?: string; // References the bank account this expense is associated with
}
