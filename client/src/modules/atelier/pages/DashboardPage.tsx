import { useTranslation } from 'react-i18next';

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16">
      <h1 className="page-title">{t('dashboard.title')}</h1>
    </main>
  );
}
