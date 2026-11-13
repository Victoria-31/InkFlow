import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useLogout } from '@/hooks/useLogout';

// Shared by the artist and client spaces
export function LogoutButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  function handleLogout() {
    logoutMutation.mutate(undefined, { onSuccess: () => navigate('/login', { replace: true }) });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button variant="secondary" onClick={handleLogout} disabled={logoutMutation.isPending}>
        {t('common.logout')}
      </Button>
      {logoutMutation.isError && (
        <p role="alert" className="text-body text-destructive">
          {t('common.genericError')}
        </p>
      )}
    </div>
  );
}
