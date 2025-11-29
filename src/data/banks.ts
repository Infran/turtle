// Common banks in Brazil and US with color schemes for placeholder images
export interface Bank {
    id: string;
    name: string;
    country: 'BR' | 'US';
    color: string; // Hex color for placeholder background
    textColor: string; // Text color for contrast
}

export const BANKS: Bank[] = [
    // Brazilian Banks
    { id: 'nubank', name: 'Nubank', country: 'BR', color: '#8A05BE', textColor: '#FFFFFF' },
    { id: 'itau', name: 'Itaú', country: 'BR', color: '#EC7000', textColor: '#FFFFFF' },
    { id: 'bradesco', name: 'Bradesco', country: 'BR', color: '#CC092F', textColor: '#FFFFFF' },
    { id: 'santander', name: 'Santander', country: 'BR', color: '#EC0000', textColor: '#FFFFFF' },
    { id: 'banco-brasil', name: 'Banco do Brasil', country: 'BR', color: '#FFF200', textColor: '#003087' },
    { id: 'caixa', name: 'Caixa Econômica', country: 'BR', color: '#0066A1', textColor: '#FFFFFF' },
    { id: 'inter', name: 'Inter', country: 'BR', color: '#FF7A00', textColor: '#FFFFFF' },
    { id: 'c6', name: 'C6 Bank', country: 'BR', color: '#000000', textColor: '#FFFFFF' },
    { id: 'sicoob', name: 'Sicoob', country: 'BR', color: '#00A859', textColor: '#FFFFFF' },
    { id: 'sicredi', name: 'Sicredi', country: 'BR', color: '#00853E', textColor: '#FFFFFF' },

    // US Banks
    { id: 'chase', name: 'Chase', country: 'US', color: '#117ACA', textColor: '#FFFFFF' },
    { id: 'bank-of-america', name: 'Bank of America', country: 'US', color: '#E31837', textColor: '#FFFFFF' },
    { id: 'wells-fargo', name: 'Wells Fargo', country: 'US', color: '#D71E28', textColor: '#FFFFFF' },
    { id: 'citi', name: 'Citi', country: 'US', color: '#056DAE', textColor: '#FFFFFF' },
    { id: 'us-bank', name: 'U.S. Bank', country: 'US', color: '#0C2074', textColor: '#FFFFFF' },
    { id: 'pnc', name: 'PNC Bank', country: 'US', color: '#F47920', textColor: '#FFFFFF' },
    { id: 'capital-one', name: 'Capital One', country: 'US', color: '#004879', textColor: '#FFFFFF' },
    { id: 'td-bank', name: 'TD Bank', country: 'US', color: '#00A758', textColor: '#FFFFFF' },
    { id: 'truist', name: 'Truist', country: 'US', color: '#3E2A7F', textColor: '#FFFFFF' },
    { id: 'american-express', name: 'American Express', country: 'US', color: '#006FCF', textColor: '#FFFFFF' },
];

export const getBanksByRegion = (region: 'US' | 'BR'): Bank[] => {
    return BANKS.filter(bank => bank.country === region);
};

export const getBankById = (id: string): Bank | undefined => {
    return BANKS.find(bank => bank.id === id);
};
