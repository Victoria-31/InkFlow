import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useFocusOnMount } from '@/hooks/useFocusOnMount';
import type { CreatedProjectRequest, PublicArtist } from '@inkflow/shared';
import { buttonVariants } from '@/components/ui/button';
import type { FormValues } from '../project-request-form';

type RequestSentProps = { artist: PublicArtist; values: FormValues; project: CreatedProjectRequest };

const longDate = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

export function RequestSent({ artist, values, project }: RequestSentProps) {
  const { t } = useTranslation();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const name = artist.firstName;
  const styles = artist.styles.filter((style) => values.tagIds.includes(style.id)).map((style) => style.name);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-16">
      <div className="flex flex-col gap-3 lg:pt-12">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {t('request.sent.reference', { id: String(project.id).padStart(3, '0'), date: longDate.format(new Date()) })}
        </p>
        <h1 ref={headingRef} tabIndex={-1} className="font-serif text-4xl outline-none sm:text-5xl">
          {t('request.sent.title')}
        </h1>
        <p role="status" className="text-sm text-muted-foreground">
          {t('request.sent.text', { firstName: values.firstName, name })}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-3 rounded-xl bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl">{values.bodyArea}</h2>
            <p className="flex items-center gap-1.5 rounded-full border border-success px-2.5 py-0.5 text-xs">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
              {t('request.sent.status')}
            </p>
          </div>
          {styles.length > 0 && <p className="text-sm text-muted-foreground">{styles.join(' / ')}</p>}
          <p className="border-t pt-3 text-sm">{t('request.sent.delay')}</p>
        </section>

        <section aria-labelledby="next-steps" className="flex flex-col gap-3">
          <h2 id="next-steps" className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            {t('request.sent.nextTitle')}
          </h2>
          <ol className="flex flex-col gap-2 text-sm">
            {[1, 2, 3].map((number) => (
              <li key={number}>
                <span className="font-serif text-primary">0{number}</span> — {t(`request.sent.next.${number}`, { name })}
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground">{t('request.sent.nextNote')}</p>
        </section>

        <Link to={`/${artist.username}`} className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
          {t('request.sent.backToStudio')}
        </Link>
        <p className="text-center text-xs text-muted-foreground">{t('request.sent.footnote', { name })}</p>
      </div>
    </div>
  );
}
