import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { PublicArtist } from '@inkflow/shared';
import logo from '@/assets/logo.svg';

export function PublicHeader({ artist }: { artist: PublicArtist }) {
  const { t } = useTranslation();

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
      <Link to={`/${artist.username}`} className="flex items-center gap-3 rounded-md">
        <img src={logo} alt="" className="size-20" />
        <span className="font-serif text-3xl">InkFlow</span>
      </Link>
      <div className="flex flex-col items-end gap-1 text-[11px] tracking-wider text-muted-foreground uppercase">
        <p>{t('header.studio', { name: artist.firstName, city: artist.city })}</p>
        <Link to="/login" className="underline underline-offset-2 hover:text-foreground">
          {t('header.clientSpace')}
        </Link>
      </div>
    </header>
  );
}
