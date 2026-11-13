import { useTranslation } from 'react-i18next';
import { Navigate, Outlet } from 'react-router';
import { useCurrentAccount } from '@/hooks/useCurrentAccount';
import { getProblem } from '@/request/http';

// Layout route shared by the protected modules (atelier, client): its child pages render only for a logged-in account
export function RequireAuth() {
  const { t } = useTranslation();
  const { isPending, error } = useCurrentAccount();

  if (isPending) {
    return <p role="status">{t('common.loading')}</p>;
  }
  if (error) {
    const isLoggedOut = getProblem(error)?.status === 401;
    if (isLoggedOut) {
      return <Navigate to="/login" replace />;
    }
    return <p role="alert">{t('common.genericError')}</p>;
  }
  return <Outlet />;
}
