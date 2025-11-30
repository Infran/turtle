import { useTranslation } from '@/hooks';

export default function About() {
    const { t } = useTranslation();

    return (
        <div className="dark:text-white p-8">
            <h1 className="text-3xl font-bold mb-4">{t('about.title')}</h1>
            <p className="text-lg mb-2">{t('about.description')}</p>
            <p className="text-gray-600 dark:text-gray-400">{t('about.content')}</p>
        </div>
    );
}
