import { useTranslation } from 'react-i18next';
import { LogoutButton } from '@/components/LogoutButton';
import { useNewScreen } from '@/hooks/useNewScreen';

export function DashboardPage() {
  const { t } = useTranslation();
  const headingRef = useNewScreen<HTMLHeadingElement>();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 ref={headingRef} tabIndex={-1} className="page-title outline-none">
          {t('dashboard.title')}
        </h1>
        <LogoutButton />
      </div>
    </main>
  );
}
