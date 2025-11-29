/// <reference types="gapi.client.sheets" />
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { gapi } from 'gapi-script';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import type { Expense } from '../types/Expense';
import { translations, type Locale } from '../i18n/translations';

interface GoogleSheetsContextType {
    user: {
        token: string;
        name?: string;
        picture?: string;
        email?: string;
    } | null;
    signIn: () => void;
    signOut: () => void;
    expenses: Expense[];
    income: Expense[];
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
    addIncome: (income: Omit<Expense, 'id'>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    deleteIncome: (id: string) => Promise<void>;
    spreadsheetId: string | null;
    incomeSheetId: string | null;
    setSpreadsheetId: (id: string) => void;
    setIncomeSheetId: (id: string) => void;
    fetchExpenses: () => Promise<void>;
    fetchIncome: () => Promise<void>;
    isInitialized: boolean;
    repairSheetStructure: () => Promise<void>;
    createNewSpreadsheet: (useSameSheet?: boolean) => Promise<string>;
}

const GoogleSheetsContext = createContext<GoogleSheetsContextType | null>(null);

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// Helper functions for i18n sheet titles and headers
const getSheetTitle = (type: 'expenses' | 'incomes', region: 'US' | 'BR'): string => {
    const locale: Locale = region === 'US' ? 'en-US' : 'pt-BR';
    const key = type === 'expenses' ? 'sheet.name.expenses' : 'sheet.name.incomes';
    return (translations[locale] as Record<string, string>)[key];
};

const getSheetHeaders = (region: 'US' | 'BR'): string[] => {
    const locale: Locale = region === 'US' ? 'en-US' : 'pt-BR';
    const t = translations[locale] as Record<string, string>;
    return [
        t['sheet.header.id'],
        t['sheet.header.date'],
        t['sheet.header.description'],
        t['sheet.header.amount'],
        t['sheet.header.type'],
        t['sheet.header.category'],
        t['sheet.header.method'],
        t['sheet.header.creditCardId'],
        t['sheet.header.bankAccountId'],
    ];
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGoogleSheets = () => {
    const context = useContext(GoogleSheetsContext);
    if (!context) {
        throw new Error('useGoogleSheets must be used within a GoogleSheetsProvider');
    }
    return context;
};

export const GoogleSheetsProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<{
        token: string;
        name?: string;
        picture?: string;
        email?: string;
    } | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [income, setIncome] = useState<Expense[]>([]);
    const [spreadsheetId, setSpreadsheetIdState] = useState<string | null>(localStorage.getItem('spreadsheetId'));
    const [incomeSheetId, setIncomeSheetIdState] = useState<string | null>(localStorage.getItem('incomeSheetId'));
    const [isInitialized, setIsInitialized] = useState(false);

    const fetchUserProfile = async (token: string) => {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setUser({ token, name: data.name, picture: data.picture, email: data.email });
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    // Initialise GAPI client
    useEffect(() => {
        const initClient = async () => {
            try {
                await gapi.client.init({
                    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
                    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    scope: SCOPES,
                    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                });
                setIsInitialized(true);
                const token = localStorage.getItem('google_token');
                if (token) {
                    setUser({ token });
                    gapi.client.setToken({ access_token: token });
                    fetchUserProfile(token);
                }
            } catch (error) {
                console.error('Error initializing GAPI client', error);
            }
        };
        gapi.load('client:auth2', initClient);
    }, []);

    const setSpreadsheetId = (id: string) => {
        localStorage.setItem('spreadsheetId', id);
        setSpreadsheetIdState(id);
    };

    const setIncomeSheetId = (id: string) => {
        localStorage.setItem('incomeSheetId', id);
        setIncomeSheetIdState(id);
    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            const token = codeResponse.access_token;
            setUser({ token });
            localStorage.setItem('google_token', token);
            gapi.client.setToken({ access_token: token });
            fetchUserProfile(token);
        },
        onError: (error) => window.alert(JSON.stringify(error)),
        scope: SCOPES,
    });

    const signIn = () => login();

    const signOut = () => {
        googleLogout();
        setUser(null);
        setExpenses([]);
        setIncome([]);
        localStorage.removeItem('google_token');
        gapi.client.setToken(null);
    };

    const getSheetTitleForSheet = async (spreadsheetIdParam: string, type: 'expenses' | 'incomes'): Promise<string> => {
        const region = localStorage.getItem('region') === 'US' ? 'US' : 'BR';
        const targetTitle = getSheetTitle(type, region);
        try {
            const response = await gapi.client.sheets.spreadsheets.get({ spreadsheetId: spreadsheetIdParam });
            const sheets = response.result.sheets;
            if (!sheets || sheets.length === 0) throw new Error('No sheets found');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const found = sheets.find((s: any) => s.properties.title === targetTitle);
            if (found) return targetTitle;
            return sheets[0].properties?.title || 'Sheet1';
        } catch (error) {
            console.error('Error getting sheet title:', error);
            throw error;
        }
    };

    const renameSheet = async (spreadsheetIdParam: string, currentTitle: string, newTitle: string) => {
        if (currentTitle === newTitle) return;
        try {
            const response = await gapi.client.sheets.spreadsheets.get({ spreadsheetId: spreadsheetIdParam });
            const sheets = response.result.sheets;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (sheets?.some((s: any) => s.properties.title === newTitle)) {
                console.log(`Sheet with title ${newTitle} already exists.`);
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sheet = sheets?.find((s: any) => s.properties.title === currentTitle);
            if (!sheet || typeof sheet.properties?.sheetId === 'undefined') {
                console.error('Could not find sheet to rename');
                return;
            }
            await gapi.client.sheets.spreadsheets.batchUpdate({
                spreadsheetId: spreadsheetIdParam,
                resource: {
                    requests: [
                        {
                            updateSheetProperties: {
                                properties: {
                                    sheetId: sheet.properties.sheetId,
                                    title: newTitle,
                                },
                                fields: 'title',
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            console.error('Error renaming sheet:', error);
        }
    };

    const checkAndWriteHeaders = async (spreadsheetIdParam: string, sheetTitle: string) => {
        const region = localStorage.getItem('region') === 'US' ? 'US' : 'BR';
        const headers = getSheetHeaders(region);
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetIdParam,
                range: `${sheetTitle}!A1:I1`,
            });
            const values = response.result.values;
            if (!values || values.length === 0) {
                await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: spreadsheetIdParam,
                    range: `${sheetTitle}!A1:I1`,
                    valueInputOption: 'RAW',
                    resource: { values: [headers] },
                });
                // Apply formatting to header row
                const sheetInfo = await gapi.client.sheets.spreadsheets.get({ spreadsheetId: spreadsheetIdParam });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const sheet = sheetInfo.result.sheets?.find((s: any) => s.properties.title === sheetTitle);
                if (sheet?.properties?.sheetId !== undefined) {
                    await gapi.client.sheets.spreadsheets.batchUpdate({
                        spreadsheetId: spreadsheetIdParam,
                        resource: {
                            requests: [
                                {
                                    repeatCell: {
                                        range: {
                                            sheetId: sheet.properties.sheetId,
                                            startRowIndex: 0,
                                            endRowIndex: 1,
                                            startColumnIndex: 0,
                                            endColumnIndex: 9,
                                        },
                                        cell: {
                                            userEnteredFormat: {
                                                backgroundColor: { red: 189 / 255, green: 207 / 255, blue: 71 / 255 }, // #bdcf47
                                                textFormat: { bold: true, foregroundColor: { red: 0, green: 0, blue: 0 } },
                                                horizontalAlignment: 'CENTER',
                                            },
                                        },
                                        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
                                    },
                                },
                            ],
                        },
                    });
                }
            }
        } catch (error) {
            console.error('Error checking/writing headers:', error);
        }
    };

    const createNewSpreadsheet = async (useSameSheet: boolean = true): Promise<string> => {
        if (!user) throw new Error('User must be signed in to create a spreadsheet');
        try {
            const region = localStorage.getItem('region') === 'US' ? 'US' : 'BR';
            const expensesTitle = getSheetTitle('expenses', region);
            const incomesTitle = getSheetTitle('incomes', region);
            const createResponse = await gapi.client.sheets.spreadsheets.create({
                resource: {
                    properties: { title: 'Turtle Finance' },
                },
            });
            const newId = createResponse.result.spreadsheetId;
            if (!newId) throw new Error('Failed to create spreadsheet');
            // Rename first sheet to expenses title
            const sheetInfo = await gapi.client.sheets.spreadsheets.get({ spreadsheetId: newId });
            const firstSheetId = sheetInfo.result.sheets?.[0]?.properties?.sheetId;
            if (firstSheetId !== undefined) {
                await gapi.client.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: newId,
                    resource: {
                        requests: [
                            {
                                updateSheetProperties: {
                                    properties: { sheetId: firstSheetId, title: expensesTitle },
                                    fields: 'title',
                                },
                            },
                        ],
                    },
                });
            }
            if (!useSameSheet) {
                // Add separate incomes sheet
                await gapi.client.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: newId,
                    resource: {
                        requests: [
                            {
                                addSheet: { properties: { title: incomesTitle } },
                            },
                        ],
                    },
                });
            }
            // Write headers
            await checkAndWriteHeaders(newId, expensesTitle);
            if (!useSameSheet) {
                await checkAndWriteHeaders(newId, incomesTitle);
            }
            // Store IDs
            setSpreadsheetId(newId);
            setIncomeSheetId(newId);
            return newId;
        } catch (error) {
            console.error('Error creating spreadsheet:', error);
            throw error;
        }
    };

    const repairSheetStructure = async () => {
        if (spreadsheetId) {
            const expensesTitle = await getSheetTitleForSheet(spreadsheetId, 'expenses');
            await checkAndWriteHeaders(spreadsheetId, expensesTitle);
        }
        if (incomeSheetId) {
            const incomesTitle = await getSheetTitleForSheet(incomeSheetId, 'incomes');
            await checkAndWriteHeaders(incomeSheetId, incomesTitle);
        }
    };

    const fetchExpenses = async () => {
        if (!spreadsheetId || !isInitialized || !user) return;
        try {
            let sheetTitle = await getSheetTitleForSheet(spreadsheetId, 'expenses');
            const region = localStorage.getItem('region') === 'US' ? 'US' : 'BR';
            const expectedTitle = getSheetTitle('expenses', region);
            if (sheetTitle !== expectedTitle) {
                await renameSheet(spreadsheetId, sheetTitle, expectedTitle);
                sheetTitle = await getSheetTitleForSheet(spreadsheetId, 'expenses');
            }
            await checkAndWriteHeaders(spreadsheetId, sheetTitle);
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetTitle}!A2:I`,
            });
            const rows = response.result.values || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const parsed: Expense[] = rows.map((row: any[]) => ({
                id: row[0],
                date: row[1],
                description: row[2],
                amount: parseFloat(row[3]),
                type: (row[4] === 'income' ? 'Income' : 'Expense') as import('../types/Expense').ExpenseType,
                category: row[5],
                method: (row[6] || 'Cash') as import('../types/Expense').PaymentMethod,
                creditCardId: row[7] || '',
                bankAccountId: row[8] || '',
            }));
            setExpenses(parsed);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error fetching expenses:', error);
            if (error.result?.error?.code === 401 || error.result?.error?.code === 403) {
                signOut();
            }
        }
    };

    const fetchIncome = async () => {
        if (!incomeSheetId || !isInitialized || !user) return;
        try {
            let sheetTitle = await getSheetTitleForSheet(incomeSheetId, 'incomes');
            const region = localStorage.getItem('region') === 'US' ? 'US' : 'BR';
            const expectedTitle = getSheetTitle('incomes', region);
            if (sheetTitle !== expectedTitle) {
                await renameSheet(incomeSheetId, sheetTitle, expectedTitle);
                sheetTitle = await getSheetTitleForSheet(incomeSheetId, 'incomes');
            }
            await checkAndWriteHeaders(incomeSheetId, sheetTitle);
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: incomeSheetId,
                range: `${sheetTitle}!A2:I`,
            });
            const rows = response.result.values || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const parsed: Expense[] = rows.map((row: any[]) => ({
                id: row[0],
                date: row[1],
                description: row[2],
                amount: parseFloat(row[3]),
                type: (row[4] === 'income' ? 'Income' : 'Expense') as import('../types/Expense').ExpenseType,
                category: row[5],
                method: (row[6] || 'Cash') as import('../types/Expense').PaymentMethod,
                creditCardId: row[7] || '',
                bankAccountId: row[8] || '',
            }));
            setIncome(parsed);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error fetching income:', error);
            if (error.result?.error?.code === 401 || error.result?.error?.code === 403) {
                signOut();
            }
        }
    };

    const addExpense = async (expense: Omit<Expense, 'id'>) => {
        if (!spreadsheetId || !user) return;
        try {
            const sheetTitle = await getSheetTitleForSheet(spreadsheetId, 'expenses');
            const newExpense = { ...expense, id: crypto.randomUUID() };
            const values = [[
                newExpense.id,
                newExpense.date,
                newExpense.description,
                newExpense.amount,
                newExpense.type,
                newExpense.category,
                newExpense.method || 'Cash',
                newExpense.creditCardId || '',
                newExpense.bankAccountId || '',
            ]];
            await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId,
                range: `${sheetTitle}!A:I`,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                resource: { values },
            });
            setExpenses([...expenses, newExpense]);
        } catch (error) {
            console.error('Error adding expense:', error);
            throw error;
        }
    };

    const addIncome = async (incomeItem: Omit<Expense, 'id'>) => {
        if (!incomeSheetId || !user) return;
        try {
            const sheetTitle = await getSheetTitleForSheet(incomeSheetId, 'incomes');
            const newIncome = { ...incomeItem, id: crypto.randomUUID() };
            const values = [[
                newIncome.id,
                newIncome.date,
                newIncome.description,
                newIncome.amount,
                newIncome.type,
                newIncome.category,
                newIncome.method || 'Cash',
                newIncome.creditCardId || '',
                newIncome.bankAccountId || '',
            ]];
            await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: incomeSheetId,
                range: `${sheetTitle}!A:I`,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                resource: { values },
            });
            setIncome([...income, newIncome]);
        } catch (error) {
            console.error('Error adding income:', error);
            throw error;
        }
    };

    const deleteRow = async (spreadsheetIdParam: string, sheetTitle: string, id: string) => {
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetIdParam,
                range: `${sheetTitle}!A:A`,
            });
            const rows = response.result.values;
            if (!rows) throw new Error('No data found');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rowIndex = rows.findIndex((row: any[]) => row[0] === id);
            if (rowIndex === -1) throw new Error('Item not found');
            const sheetInfo = await gapi.client.sheets.spreadsheets.get({ spreadsheetId: spreadsheetIdParam });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sheet = sheetInfo.result.sheets?.find((s: any) => s.properties.title === sheetTitle);
            if (!sheet || typeof sheet.properties?.sheetId === 'undefined') throw new Error('Sheet not found');
            await gapi.client.sheets.spreadsheets.batchUpdate({
                spreadsheetId: spreadsheetIdParam,
                resource: {
                    requests: [
                        {
                            deleteDimension: {
                                range: {
                                    sheetId: sheet.properties.sheetId,
                                    dimension: 'ROWS',
                                    startIndex: rowIndex,
                                    endIndex: rowIndex + 1,
                                },
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            console.error('Error deleting row:', error);
            throw error;
        }
    };

    const deleteExpense = async (id: string) => {
        if (!spreadsheetId || !user) return;
        try {
            const sheetTitle = await getSheetTitleForSheet(spreadsheetId, 'expenses');
            await deleteRow(spreadsheetId, sheetTitle, id);
            await fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
            throw error;
        }
    };

    const deleteIncome = async (id: string) => {
        if (!incomeSheetId || !user) return;
        try {
            const sheetTitle = await getSheetTitleForSheet(incomeSheetId, 'incomes');
            await deleteRow(incomeSheetId, sheetTitle, id);
            await fetchIncome();
        } catch (error) {
            console.error('Error deleting income:', error);
            throw error;
        }
    };

    return (
        <GoogleSheetsContext.Provider
            value={{
                user,
                signIn,
                signOut,
                expenses,
                income,
                addExpense,
                addIncome,
                deleteExpense,
                deleteIncome,
                spreadsheetId,
                incomeSheetId,
                setSpreadsheetId,
                setIncomeSheetId,
                fetchExpenses,
                fetchIncome,
                isInitialized,
                repairSheetStructure,
                createNewSpreadsheet,
            }}
        >
            {children}
        </GoogleSheetsContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGoogleSheetsContext = useGoogleSheets; // Alias for backward compatibility if needed
