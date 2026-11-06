import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNewScreen } from '@/hooks/useNewScreen';
import type { CreatedProjectRequest, PublicArtist } from '@inkflow/shared';
import { buttonVariants } from '@/components/ui/Button';
import { KoiIllustration } from '../components/KoiIllustration';
import type { FormValues } from '../project-request-form';

type RequestSentProps = { artist: PublicArtist; values: FormValues; project: CreatedProjectRequest };

export function RequestSent({ artist, values, project }: RequestSentProps) {
  const { t, i18n } = useTranslation();
  const longDate = new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' });
  const headingRef = useNewScreen<HTMLHeadingElement>();
  const name = artist.firstName;
  const styles = artist.styles.filter((style) => values.tagIds.includes(style.id)).map((style) => style.name);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-16">
      <div className="relative isolate flex flex-col gap-3 lg:sticky lg:top-8 lg:min-h-128 lg:self-start">
        <p className="eyebrow">
          {t('request.sent.reference', { id: String(project.id).padStart(3, '0'), date: longDate.format(new Date()) })}
        </p>
        <h1 ref={headingRef} tabIndex={-1} className="page-title outline-none">
          {t('request.sent.title')}
        </h1>
        <p role="status" className="text-body text-muted-foreground">
          {t('request.sent.text', { firstName: values.firstName, name })}
        </p>
        <KoiIllustration />
      </div>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-3 rounded-xl bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="page-title">{values.bodyArea}</h2>
            <p className="flex items-center gap-2 rounded-full border border-success px-3 py-1 text-small">
              <span className="size-2 rounded-full bg-success" />
              {t('request.sent.status')}
            </p>
          </div>
          {styles.length > 0 && <p className="text-body text-muted-foreground">{styles.join(' / ')}</p>}
        </section>

        <section aria-labelledby="next-steps" className="flex flex-col gap-3">
          <h2 id="next-steps" className="eyebrow">
            {t('request.sent.nextTitle')}
          </h2>
          <ol className="flex flex-col gap-4">
            {[1, 2, 3].map((number) => (
              <li key={number} className="flex items-center gap-4">
                {/* The list already announces the order: the big number is only visual */}
                <span aria-hidden="true" className="w-12 shrink-0 page-title leading-none text-primary-light">
                  0{number}
                </span>
                <p className="text-body">{t(`request.sent.next.${number}`, { name })}</p>
              </li>
            ))}
          </ol>
          <p className="text-small text-muted-foreground">{t('request.sent.nextNote')}</p>
        </section>

        <Link to={`/${artist.username}`} className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
          {t('request.sent.backToStudio')}
        </Link>
        <p className="text-center text-small text-muted-foreground">{t('request.sent.footnote', { name })}</p>
      </div>
    </div>
  );
}
