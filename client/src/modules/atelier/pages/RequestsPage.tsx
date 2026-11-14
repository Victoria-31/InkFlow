import { Outlet, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { cn } from 'cn';
import { useNewScreen } from '@/hooks/useNewScreen';
import { RequestCard } from '../components/RequestCard';
import { useArtistProjects } from '../hooks/useArtistProjects';

export function RequestsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const isRequestOpen = id !== undefined;
  const headingRef = useNewScreen<HTMLHeadingElement>({ active: !isRequestOpen });
  const { data: requests, isPending, isError } = useArtistProjects('REQUEST');
  const hasRequests = requests !== undefined && requests.length > 0;

  let list;
  if (isPending) {
    list = <p role="status">{t('common.loading')}</p>;
  } else if (isError) {
    list = <p role="alert">{t('common.genericError')}</p>;
  } else if (!hasRequests) {
    list = (
      <section aria-labelledby="no-request" className="flex flex-col gap-2 rounded-lg border bg-card p-6">
        <h2 id="no-request" className="text-body font-semibold">
          {t('requests.emptyTitle')}
        </h2>
        <p className="text-body text-muted-foreground">{t('requests.emptyText')}</p>
      </section>
    );
  } else {
    list = (
      <ul aria-label={t('requests.listLabel')} className="flex flex-col gap-3">
        {requests.map((request) => (
          <li key={request.id}>
            <RequestCard request={request} />
          </li>
        ))}
      </ul>
    );
  }

  // An open request shows even if it is no longer listed
  const hasTwoColumns = isRequestOpen || hasRequests;
  let detailClass = 'hidden';
  if (isRequestOpen) {
    detailClass = '';
  } else if (hasRequests) {
    detailClass = 'hidden lg:block';
  }
  detailClass = cn(detailClass, 'lg:sticky lg:top-6');

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8">
      {/* sr-only: the page keeps its h1 */}
      <div className={cn('flex flex-col gap-2', isRequestOpen && 'max-lg:sr-only')}>
        <p className="eyebrow">{t('requests.eyebrow')}</p>
        <h1 ref={headingRef} tabIndex={-1} className="page-title outline-none">
          {t('requests.title')}
        </h1>
        {hasRequests && <p className="text-body text-muted-foreground">{t('requests.count', { count: requests.length })}</p>}
      </div>
      <div className={cn(hasTwoColumns && 'lg:grid lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start lg:gap-6')}>
        <div className={cn(isRequestOpen && 'hidden lg:block')}>{list}</div>
        <div className={detailClass}>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
