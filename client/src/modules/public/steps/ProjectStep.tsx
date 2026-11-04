import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TextField } from '@/components/ui/text-field';
import { AvailabilityGrid } from '../components/AvailabilityGrid';
import { toggle } from '../project-request-form';
import { FieldError } from './FieldError';
import type { StepProps } from './types';

export function ProjectStep({ artist, values, errors, errorText, update }: StepProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="bodyArea"
          label={`${t('request.project.bodyArea')} *`}
          hint={t('request.project.bodyAreaHint')}
          value={values.bodyArea}
          onChange={(value) => update({ bodyArea: value })}
          error={errorText('bodyArea')}
        />
        <TextField
          id="size"
          label={`${t('request.project.size')} *`}
          hint={t('request.project.sizeHint')}
          value={values.size}
          onChange={(value) => update({ size: value })}
          error={errorText('size')}
        />
      </div>

      <fieldset aria-describedby={errors.tagIds ? 'tagIds-error' : undefined} className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">{t('request.project.styles')}</legend>
        <ul className="flex flex-wrap gap-2">
          {artist.styles.map((style) => (
            <li key={style.id}>
              <Label className="relative cursor-pointer rounded-full border bg-card px-3 py-2 text-xs font-normal has-data-checked:border-primary has-data-checked:bg-primary has-data-checked:text-primary-foreground has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
                <Checkbox
                  className="absolute size-px opacity-0"
                  checked={values.tagIds.includes(style.id)}
                  onCheckedChange={() => update({ tagIds: toggle(values.tagIds, style.id) })}
                  aria-invalid={Boolean(errors.tagIds)}
                />
                {style.name}
              </Label>
            </li>
          ))}
        </ul>
        <FieldError id="tagIds-error" message={errorText('tagIds')} />
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="budgetMin"
          inputMode="numeric"
          label={t('request.project.budgetMin')}
          value={values.budgetMin}
          onChange={(value) => update({ budgetMin: value })}
          error={errorText('budgetMin')}
        />
        <TextField
          id="budgetMax"
          inputMode="numeric"
          label={t('request.project.budgetMax')}
          value={values.budgetMax}
          onChange={(value) => update({ budgetMax: value })}
          error={errorText('budgetMax')}
        />
      </div>

      <TextField
        id="description"
        multiline
        label={`${t('request.project.description')} *`}
        hint={t('request.project.descriptionHint')}
        value={values.description}
        onChange={(value) => update({ description: value })}
        error={errorText('description')}
      />

      <fieldset
        aria-describedby={errors.availability ? 'availability-hint availability-error' : 'availability-hint'}
        className="flex flex-col gap-3"
      >
        <legend className="mb-2 text-sm font-medium">{`${t('request.project.availability')} *`}</legend>
        <p id="availability-hint" className="text-sm text-muted-foreground">
          {t('request.project.availabilityHint')}
        </p>
        <AvailabilityGrid
          workingSlots={artist.workingSlots}
          value={values.availability}
          onToggle={(slot) => update({ availability: toggle(values.availability, slot) })}
          invalid={Boolean(errors.availability)}
        />
        <Label className="font-normal">
          <Checkbox checked={values.flexibleSchedule} onCheckedChange={(checked) => update({ flexibleSchedule: checked })} />
          {t('request.project.flexibleSchedule')}
        </Label>
        <FieldError id="availability-error" message={errorText('availability')} />
      </fieldset>
    </>
  );
}
