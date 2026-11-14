import { useId } from 'react';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { ArtistProjectListItem } from '@inkflow/shared';
import { formatBudget } from '@/format';
import { StyleTags } from './StyleTags';

export function RequestCard({ request }: { request: ArtistProjectListItem }) {
  const { t, i18n } = useTranslation();
  const receivedOn = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }).format(
    new Date(request.createdAt),
  );
  const id = useId();
  const nameId = `${id}-name`;
  const dateId = `${id}-date`;
  const detailsId = `${id}-details`;

  // Named by the prospect only, the rest is read as a description
  return (
    <NavLink
      to={`/artist/requests/${request.id}`}
      aria-labelledby={nameId}
      aria-describedby={`${dateId} ${detailsId}`}
      className="flex flex-col gap-2 rounded-lg border bg-card p-4 hover:border-input aria-[current=page]:border-primary-light aria-[current=page]:ring-1 aria-[current=page]:ring-primary-light"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span id={nameId} className="text-body font-semibold">
          {request.firstName} {request.lastName}
        </span>
        <time id={dateId} dateTime={request.createdAt} className="text-small text-muted-foreground">
          {receivedOn}
        </time>
      </div>
      <div id={detailsId} className="flex flex-col gap-2">
        <p className="text-body text-muted-foreground">{request.bodyArea}</p>
        <div className="flex items-end justify-between gap-4">
          <StyleTags styles={request.styles} />
          <span className="text-body font-medium whitespace-nowrap">{formatBudget(t, i18n.language, request)}</span>
        </div>
      </div>
    </NavLink>
  );
}
