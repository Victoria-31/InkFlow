import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useLogout } from '@/hooks/useLogout';
import { useNewScreen } from '@/hooks/useNewScreen';

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const headingRef = useNewScreen<HTMLHeadingElement>();
  const logoutMutation = useLogout();

  function handleLogout() {
    logoutMutation.mutate(undefined, { onSuccess: () => navigate('/login', { replace: true }) });
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 ref={headingRef} tabIndex={-1} className="page-title outline-none">
          {t('dashboard.title')}
        </h1>
        <Button variant="secondary" onClick={handleLogout} disabled={logoutMutation.isPending}>
          {t('dashboard.logout')}
        </Button>
      </div>
      {logoutMutation.isError && (
        <p role="alert" className="text-body text-destructive">
          {t('common.genericError')}
        </p>
      )}
    </main>
  );
}
