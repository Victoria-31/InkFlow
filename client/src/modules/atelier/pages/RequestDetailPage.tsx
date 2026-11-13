import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNewScreen } from '@/hooks/useNewScreen';
import { formatBudget, formatSlot } from '@/format';
import { getProblem } from '@/request/http';
import { StyleTags } from '../components/StyleTags';
import { useArtistProject } from '../hooks/useArtistProject';

export function RequestDetailPage() {
  const { id } = useParams();
  // key: a new request is a new screen, so the focus moves to its heading again
  return <RequestDetail key={id} id={Number(id)} />;
}

function RequestDetail({ id }: { id: number }) {
  const { t, i18n } = useTranslation();
  const headingRef = useNewScreen<HTMLHeadingElement>();
  const { data: request, isPending, error } = useArtistProject(id);

  const backLink = (
    <Link
      to="/artist/requests"
      className="text-body font-semibold text-primary-light underline-offset-4 hover:underline lg:hidden"
    >
      ‹ {t('requests.back')}
    </Link>
  );

  if (isPending) {
    return <p role="status">{t('common.loading')}</p>;
  }
  if (error) {
    // 404 also covers another artist's request (and a malformed id, 400): the page says the same thing
    const status = getProblem(error)?.status;
    const message = status === 404 || status === 400 ? t('requests.notFound') : t('common.genericError');
    return (
      <div className="flex flex-col gap-4">
        {backLink}
        <p role="alert" className="text-body">
          {message}
        </p>
      </div>
    );
  }

  const receivedOn = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(new Date(request.createdAt));
  const slots = request.availability.map((slot) => formatSlot(t, slot));
  if (request.flexibleSchedule) slots.push(t('requests.flexible'));

  return (
    <article aria-labelledby="request-name" className="flex flex-col gap-6">
      {backLink}
      <div className="flex flex-col gap-6 rounded-xl border bg-card p-6">
        <header className="flex flex-col gap-2 border-b pb-6">
          <p className="eyebrow">{t('requests.reference', { id: String(request.id).padStart(3, '0'), date: receivedOn })}</p>
          <h2 id="request-name" ref={headingRef} tabIndex={-1} className="font-serif text-title outline-none">
            {request.firstName} {request.lastName}
          </h2>
          <a href={`mailto:${request.email}`} className="text-body text-primary-light underline-offset-4 hover:underline">
            {request.email}
          </a>
        </header>

        <dl className="grid gap-x-6 gap-y-4 text-body sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <dt className="text-small text-muted-foreground">{t('requests.bodyArea')}</dt>
            <dd className="font-medium">{request.bodyArea}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-small text-muted-foreground">{t('requests.size')}</dt>
            <dd className="font-medium">{request.size}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-small text-muted-foreground">{t('requests.budget')}</dt>
            <dd className="font-medium">{formatBudget(t, i18n.language, request)}</dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className="text-small text-muted-foreground">{t('requests.styles')}</dt>
            <dd>{request.styles.length > 0 ? <StyleTags styles={request.styles} /> : t('budget.none')}</dd>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <dt className="text-small text-muted-foreground">{t('requests.availability')}</dt>
            <dd>{slots.join(', ')}</dd>
          </div>
        </dl>

        <section aria-labelledby="request-description" className="flex flex-col gap-2">
          <h3 id="request-description" className="text-small text-muted-foreground">
            {t('requests.description')}
          </h3>
          <p className="rounded-lg bg-muted p-4 text-body whitespace-pre-line">{request.description}</p>
        </section>
      </div>
    </article>
  );
}
