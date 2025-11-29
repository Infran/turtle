export interface CreditCard {
    id: string;
    name: string; // e.g., "Visa Gold", "Mastercard Platinum"
    lastFourDigits?: string; // Optional last 4 digits
    bankAccountId: string; // The bank account this card is linked to for billing
}

