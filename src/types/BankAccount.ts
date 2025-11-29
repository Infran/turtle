export interface BankAccount {
    id: string;
    bankName: string;
    accountType: 'Checking' | 'Savings';
    agency?: string;
    accountNumber?: string;
    initialBalance?: number; // Optional initial balance
}
