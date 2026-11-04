import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-16">
      <h1 className="font-serif text-5xl">{t('notFound.title')}</h1>
      <p className="text-muted-foreground">{t('notFound.text')}</p>
    </main>
  );
}
