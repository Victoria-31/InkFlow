import type { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { PublicArtist } from '@inkflow/shared';
import { getProblem } from '@/request/http';
import { NotFoundPage } from '../pages/NotFoundPage';

// Loading and error screens shared by the public pages
export function ArtistQueryState({ query }: { query: UseQueryResult<PublicArtist> }) {
  const { t } = useTranslation();

  if (query.isError && getProblem(query.error)?.status === 404) {
    return <NotFoundPage kind="artist" />;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      {query.isError ? <p role="alert">{t('common.genericError')}</p> : <p role="status">{t('common.loading')}</p>}
    </main>
  );
}
