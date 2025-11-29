import { useState } from 'react';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { useTranslation } from '../hooks/useTranslation';

export default function ConnectSheet() {
    const { setSpreadsheetId, signOut } = useGoogleSheets();
    const { t } = useTranslation();
    const [inputSheetId, setInputSheetId] = useState('');

    const handleSetSheetId = () => {
        if (inputSheetId) {
            setSpreadsheetId(inputSheetId);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t('connect.title')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('connect.description')}
                <br />
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">docs.google.com/spreadsheets/d/<b>SPREADSHEET_ID</b>/edit</code>
            </p>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder={t('connect.placeholder')}
                    value={inputSheetId}
                    onChange={(e) => setInputSheetId(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button
                    onClick={handleSetSheetId}
                    className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                >
                    {t('connect.button')}
                </button>
                <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline w-full text-center">
                    {t('auth.signOut')}
                </button>
            </div>
        </div>
    );
}
