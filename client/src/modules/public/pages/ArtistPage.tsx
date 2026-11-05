import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { ArtistQueryState } from '../components/ArtistQueryState';
import { PublicPage } from '../components/PublicPage';
import { useArtist } from '../hooks/useArtist';

export function ArtistPage() {
  const { username = '' } = useParams();
  const { t } = useTranslation();
  const query = useArtist(username);

  if (!query.isSuccess) return <ArtistQueryState query={query} />;

  const artist = query.data;
  const fullName = `${artist.firstName} ${artist.lastName}`;

  return (
    <PublicPage artist={artist}>
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pt-8">
        <div className="relative overflow-hidden rounded-xl bg-card">
          {artist.portrait && (
            <img
              src={artist.portrait}
              alt={t('artist.photoAlt', { name: artist.firstName })}
              className="aspect-[4/5] w-full object-cover sm:aspect-square"
            />
          )}
          {/* Gradient so the title stays readable on the photo */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-background via-background/80 to-transparent p-6 pt-24 sm:p-8">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {fullName} / {artist.city}
            </p>
            <h1 className="font-serif text-4xl leading-none sm:text-6xl">{t('artist.tagline')}</h1>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {artist.specialties.length > 0 && (
            <ul aria-label={t('artist.specialties')} className="flex flex-wrap gap-2">
              {artist.specialties.map((tag) => (
                <li key={tag.id} className="rounded-full bg-card px-3 py-1 text-xs">
                  {tag.name}
                </li>
              ))}
            </ul>
          )}
          {artist.bio && <p className="text-sm text-muted-foreground">{artist.bio}</p>}

          <section aria-labelledby="journey" className="flex flex-col gap-4">
            <h2 id="journey" className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {t('artist.journeyTitle')}
            </h2>
            <ol className="flex flex-col gap-4">
              {[1, 2, 3].map((number) => (
                <li key={number} className="flex items-baseline gap-4">
                  <span aria-hidden="true" className="font-serif text-2xl leading-none text-primary">
                    0{number}
                  </span>
                  <div>
                    <p className="text-sm">{t(`artist.journey.${number}.title`)}</p>
                    <p className="text-xs text-muted-foreground">{t(`artist.journey.${number}.text`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <Link to={`/${artist.username}/request`} className={buttonVariants({ size: 'lg', className: 'h-11' })}>
            {t('artist.cta')} <ArrowRight aria-hidden="true" />
          </Link>
          <p className="text-center text-xs text-muted-foreground lg:text-left">{t('artist.ctaNote')}</p>
        </div>
      </div>
    </PublicPage>
  );
}
