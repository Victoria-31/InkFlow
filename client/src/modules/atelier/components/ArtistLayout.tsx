import { Link, NavLink, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LogoutButton } from '@/components/LogoutButton';
import logo from '@/assets/logo.svg';

const navLinkClass =
  'flex h-11 items-center border-b-2 border-transparent text-body text-muted-foreground hover:text-foreground aria-[current=page]:border-primary-light aria-[current=page]:font-semibold aria-[current=page]:text-foreground';

// Header and navigation shared by every page of the artist space
export function ArtistLayout() {
  const { t } = useTranslation();

  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-2 sm:px-8">
          <Link to="/artist" className="flex items-center gap-2 rounded-md">
            <img src={logo} alt="" className="size-16" />
            {/* Part of the logo: not counted in the three text sizes of the page */}
            <span className="font-serif text-title">InkFlow</span>
          </Link>
          <nav aria-label={t('artistNav.label')} className="order-last flex w-full gap-6 sm:order-none sm:w-auto sm:flex-1">
            <NavLink to="/artist" end className={navLinkClass}>
              {t('artistNav.dashboard')}
            </NavLink>
            <NavLink to="/artist/requests" className={navLinkClass}>
              {t('artistNav.requests')}
            </NavLink>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <Outlet />
    </>
  );
}
