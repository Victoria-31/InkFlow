import { useTranslation } from 'react-i18next';
import { useNewScreen } from '@/hooks/useNewScreen';

export function DashboardPage() {
  const { t } = useTranslation();
  const headingRef = useNewScreen<HTMLHeadingElement>();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-8">
      <h1 ref={headingRef} tabIndex={-1} className="page-title outline-none">
        {t('dashboard.title')}
      </h1>
    </main>
  );
}
