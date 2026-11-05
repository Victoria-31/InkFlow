import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { ChoicePill } from '@/components/ui/choice-pill';
import { Label } from '@/components/ui/label';
import { TextField } from '@/components/ui/text-field';
import { AvailabilityGrid } from '../components/AvailabilityGrid';
import { toggle } from '../project-request-form';
import { FieldError } from './FieldError';
import type { StepProps } from './types';

export function ProjectStep({ artist, values, errors, errorText, update }: StepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="bodyArea"
            label={`${t('request.project.bodyArea')} *`}
            placeholder={t('request.project.bodyAreaPlaceholder')}
            value={values.bodyArea}
            onChange={(value) => update({ bodyArea: value })}
            error={errorText('bodyArea')}
          />
          <TextField
            id="size"
            label={`${t('request.project.size')} *`}
            placeholder={t('request.project.sizePlaceholder')}
            value={values.size}
            onChange={(value) => update({ size: value })}
            error={errorText('size')}
          />
        </div>

        <fieldset aria-describedby={errors.tagIds ? 'tagIds-error' : undefined} className="flex flex-col gap-2">
          <legend className="mb-2 text-body font-medium">{t('request.project.styles')}</legend>
          <ul className="flex flex-wrap gap-2">
            {artist.styles.map((style) => (
              <li key={style.id}>
                <ChoicePill
                  label={style.name}
                  checked={values.tagIds.includes(style.id)}
                  onChange={() => update({ tagIds: toggle(values.tagIds, style.id) })}
                  invalid={Boolean(errors.tagIds)}
                />
              </li>
            ))}
          </ul>
          <FieldError id="tagIds-error" message={errorText('tagIds')} />
        </fieldset>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-body font-medium">{t('request.project.budget')}</legend>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            id="budgetMin"
            secondary
            inputMode="numeric"
            label={t('request.project.budgetMin')}
            value={values.budgetMin}
            onChange={(value) => update({ budgetMin: value })}
            error={errorText('budgetMin')}
          />
          <TextField
            id="budgetMax"
            secondary
            inputMode="numeric"
            label={t('request.project.budgetMax')}
            value={values.budgetMax}
            onChange={(value) => update({ budgetMax: value })}
            error={errorText('budgetMax')}
          />
        </div>
      </fieldset>

      <TextField
        id="description"
        multiline
        label={`${t('request.project.description')} *`}
        placeholder={t('request.project.descriptionPlaceholder')}
        maxLength={2000}
        value={values.description}
        onChange={(value) => update({ description: value })}
        error={errorText('description')}
      />

      <fieldset
        aria-describedby={errors.availability ? 'availability-hint availability-error' : 'availability-hint'}
        className="flex flex-col gap-3"
      >
        <legend className="mb-2 text-body font-medium">{`${t('request.project.availability')} *`}</legend>
        <p id="availability-hint" className="text-small text-muted-foreground">
          {t('request.project.availabilityHint')}
        </p>
        <AvailabilityGrid
          workingSlots={artist.workingSlots}
          selectedSlots={values.availability}
          onToggle={(slot) => update({ availability: toggle(values.availability, slot) })}
          invalid={Boolean(errors.availability)}
        />
        <Label className="mt-2 font-normal">
          <Checkbox checked={values.flexibleSchedule} onChange={(event) => update({ flexibleSchedule: event.target.checked })} />
          {t('request.project.flexibleSchedule')}
        </Label>
        <FieldError id="availability-error" message={errorText('availability')} />
      </fieldset>
    </div>
  );
}
