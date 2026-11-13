import { Outlet, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { cn } from 'cn';
import { useNewScreen } from '@/hooks/useNewScreen';
import { RequestCard } from '../components/RequestCard';
import { useArtistProjects } from '../hooks/useArtistProjects';

// List on the left, open request on the right (child route). On small screens, one at a time.
export function RequestsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const isRequestOpen = id !== undefined;
  // The open request takes the focus; the list takes it back when the user returns to it
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

  // The open request shows even when it is not in the list (no request left, or already past REQUEST)
  const hasTwoColumns = isRequestOpen || hasRequests;
  let detailClass = 'hidden';
  if (isRequestOpen) {
    detailClass = '';
  } else if (hasRequests) {
    detailClass = 'hidden lg:block';
  }
  // Stays in view while the list scrolls: a click on a card low in the list shows its request at once
  detailClass = cn(detailClass, 'lg:sticky lg:top-6');

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8">
      {/* Hidden on small screens while a request is open, but kept for screen readers: the page keeps its h1 */}
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
