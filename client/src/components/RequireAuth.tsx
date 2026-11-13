import { useTranslation } from 'react-i18next';
import { Navigate, Outlet } from 'react-router';
import type { Role } from '@inkflow/shared';
import { useCurrentAccount } from '@/hooks/useCurrentAccount';
import { getProblem } from '@/request/http';
import { HOME_PATHS } from '@/home-paths';

type RequireAuthProps = { role: Role };

// Layout route of a protected module (atelier, client): its child pages render only for a logged-in account of that role.
// This only guides navigation; the API enforces access on its own.
export function RequireAuth({ role }: RequireAuthProps) {
  const { t } = useTranslation();
  const { data: account, isPending, error } = useCurrentAccount();

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
  if (account.role !== role) {
    return <Navigate to={HOME_PATHS[account.role]} replace />;
  }
  return <Outlet />;
}
