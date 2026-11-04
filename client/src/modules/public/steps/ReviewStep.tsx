import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FieldError } from './FieldError';
import type { StepProps } from './types';

const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export function ReviewStep({ artist, values, errors, errorText, update }: StepProps) {
  const { t } = useTranslation();
  const none = t('request.review.none');

  const styles = artist.styles.filter((style) => values.tagIds.includes(style.id)).map((style) => style.name);
  const budget = [values.budgetMin, values.budgetMax]
    .filter((amount) => amount !== '')
    .map((amount) => euros.format(Number(amount)));
  const slots = values.availability.map((slot) => {
    const [day, half] = slot.split('_');
    return `${t(`days.${day}`)} ${t(`halfDays.${half}`)}`;
  });
  if (values.flexibleSchedule) slots.push(t('request.review.flexible'));

  const rows = [
    [t('request.review.bodyArea'), `${values.bodyArea} · ${values.size}`],
    [t('request.review.styles'), styles.join(' · ') || none],
    [t('request.review.budget'), budget.join(' – ') || none],
    [t('request.review.availability'), slots.join(', ')],
  ];

  return (
    <>
      <section aria-labelledby="review-project" className="flex flex-col gap-4 rounded-xl bg-card p-5">
        <h2 id="review-project" className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {t('request.review.projectTitle')}
        </h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="border-t pt-4 text-sm whitespace-pre-line text-muted-foreground">{values.description}</p>
      </section>

      <div className="text-sm">
        <p className="font-semibold">
          {values.firstName} {values.lastName}
        </p>
        <p className="text-muted-foreground">{values.email}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="items-start leading-snug font-normal">
          <Checkbox
            className="mt-0.5"
            checked={values.consent}
            onCheckedChange={(checked) => update({ consent: checked })}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          {t('request.review.consent', { name: artist.firstName })}
        </Label>
        <FieldError id="consent-error" message={errorText('consent')} />
        <p className="text-xs text-muted-foreground">{t('request.review.privacy')}</p>
      </div>
    </>
  );
}
