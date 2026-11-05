import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export function PublicFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t px-4 py-6 text-small text-muted-foreground sm:px-8">
      <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      <nav aria-label={t('footer.nav')}>
        <ul className="flex gap-6">
          <li>
            <Link to="/legal" className="hover:text-foreground">
              {t('footer.legal')}
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="hover:text-foreground">
              {t('footer.privacy')}
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
