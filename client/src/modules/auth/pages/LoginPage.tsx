import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-16">
      <h1 className="page-title">{t('login.title')}</h1>
    </main>
  );
}
