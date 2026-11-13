import { useTranslation } from 'react-i18next';

// Right-hand panel on large screens, before a request is chosen (hidden on small screens)
export function NoRequestSelected() {
  const { t } = useTranslation();
  return <p className="rounded-lg border border-dashed p-6 text-body text-muted-foreground">{t('requests.select')}</p>;
}
