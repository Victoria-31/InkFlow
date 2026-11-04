import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getProblem } from '@/request/http';
import { ProjectRequestForm } from '../components/ProjectRequestForm';
import { useArtist } from '../hooks/useArtist';
import { NotFoundPage } from './NotFoundPage';

export function ProjectRequestPage() {
  const { username = '' } = useParams();
  const { t } = useTranslation();
  const artist = useArtist(username);

  if (artist.isPending) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <p role="status">{t('common.loading')}</p>
      </main>
    );
  }

  if (artist.isError) {
    if (getProblem(artist.error)?.status === 404) return <NotFoundPage />;
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <p role="alert">{t('common.genericError')}</p>
      </main>
    );
  }

  const { firstName, lastName, city, bio, specialties } = artist.data;

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-12 px-4 py-12">
      <header className="flex flex-col gap-3">
        {city && <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{city}</p>}
        <h1 className="font-serif text-5xl">
          {firstName} {lastName}
        </h1>
        {bio && <p className="text-muted-foreground">{bio}</p>}
        {specialties.length > 0 && (
          <ul aria-label={t('projectRequest.specialties')} className="flex flex-wrap gap-2">
            {specialties.map((tag) => (
              <li key={tag.id} className="rounded-full bg-card px-3 py-1 text-sm">
                {tag.name}
              </li>
            ))}
          </ul>
        )}
      </header>

      <section aria-labelledby="request-title" className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 id="request-title" className="font-serif text-4xl">
            {t('projectRequest.title')}
          </h2>
          <p className="text-muted-foreground">{t('projectRequest.intro')}</p>
        </div>
        <ProjectRequestForm artist={artist.data} />
      </section>
    </main>
  );
}
