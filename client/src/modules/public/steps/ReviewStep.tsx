import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { toRequest } from '../project-request-form';
import { FieldError } from './FieldError';
import type { StepProps } from './types';

export function ReviewStep({ artist, values, errors, errorText, update }: StepProps) {
  const { t, i18n } = useTranslation();
  const none = t('request.review.none');
  const euros = new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  const styles = artist.styles.filter((style) => values.tagIds.includes(style.id)).map((style) => style.name);

  const { budgetMin, budgetMax } = toRequest(values);
  let budget = none;
  if (budgetMin !== undefined && budgetMax !== undefined) {
    budget = `${euros.format(budgetMin)} – ${euros.format(budgetMax)}`;
  } else if (budgetMin !== undefined) {
    budget = t('request.review.budgetFrom', { amount: euros.format(budgetMin) });
  } else if (budgetMax !== undefined) {
    budget = t('request.review.budgetUpTo', { amount: euros.format(budgetMax) });
  }

  const slots = values.availability.map((slot) => {
    const [day, half] = slot.split('_');
    return `${t(`days.${day}`)} ${t(`halfDays.${half}`)}`;
  });
  if (values.flexibleSchedule) slots.push(t('request.review.flexible'));

  const rows = [
    [t('request.review.bodyArea'), `${values.bodyArea} · ${values.size}`],
    [t('request.review.styles'), styles.join(' · ') || none],
    [t('request.review.budget'), budget],
    [t('request.review.availability'), slots.join(', ')],
  ];

  return (
    <>
      <section aria-labelledby="review-project" className="flex flex-col gap-4 rounded-xl bg-card p-5">
        <h2 id="review-project" className="eyebrow">
          {t('request.review.projectTitle')}
        </h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-body">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="border-t pt-4 text-body whitespace-pre-line text-muted-foreground">{values.description}</p>
      </section>

      <div className="text-body">
        <p className="font-semibold">
          {values.firstName} {values.lastName}
        </p>
        <p className="text-muted-foreground">{values.email}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="items-start leading-snug font-normal">
          <Checkbox
            className="mt-1"
            checked={values.consent}
            onChange={(event) => update({ consent: event.target.checked })}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          {t('request.review.consent', { name: artist.firstName })}
        </Label>
        <FieldError id="consent-error" message={errorText('consent')} />
        <p className="text-small text-muted-foreground">{t('request.review.privacy')}</p>
      </div>
    </>
  );
}
