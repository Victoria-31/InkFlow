import { useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { projectRequestSchema, validate, type Availability, type FieldErrors, type PublicArtist } from '@inkflow/shared';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TextField } from '@/components/ui/text-field';
import { getProblem } from '@/request/http';
import { useCreateProjectRequest } from '../hooks/useCreateProjectRequest';
import { AvailabilityGrid } from './AvailabilityGrid';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  bodyArea: '',
  size: '',
  description: '',
  budgetMin: '',
  budgetMax: '',
  tagIds: [] as number[],
  availability: [] as Availability[],
  flexibleSchedule: false,
};

type FormValues = typeof emptyForm;
type TextFieldName = 'firstName' | 'lastName' | 'email' | 'bodyArea' | 'size' | 'description' | 'budgetMin' | 'budgetMax';

function toggle<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

// An empty budget field means "no budget"
function toAmount(value: string) {
  return value.trim() === '' ? undefined : Number(value);
}

// "availability.0" → "availability": errors are shown once per field
function byField(errors: FieldErrors) {
  const result: FieldErrors = {};
  for (const [path, code] of Object.entries(errors)) {
    result[path.split('.')[0]] ??= code;
  }
  return result;
}

export function ProjectRequestForm({ artist }: { artist: PublicArtist }) {
  const { t } = useTranslation();
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const createRequest = useCreateProjectRequest(artist.username);

  const errorText = (field: string) => (errors[field] ? t(`errors.${errors[field]}`) : undefined);
  const setText = (field: TextFieldName, value: string) => setValues({ ...values, [field]: value });

  function showErrors(fieldErrors: FieldErrors) {
    // Render the errors first, then move the focus to the first invalid field
    flushSync(() => setErrors(byField(fieldErrors)));
    document.querySelector<HTMLElement>('form [aria-invalid="true"]')?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const request = { ...values, budgetMin: toAmount(values.budgetMin), budgetMax: toAmount(values.budgetMax) };
    const result = validate(projectRequestSchema, request);
    if (!result.success) {
      showErrors(result.errors);
      return;
    }
    setErrors({});
    createRequest.mutate(result.data, {
      onError: (error) => {
        const fieldErrors = getProblem(error)?.errors;
        if (fieldErrors) showErrors(fieldErrors);
      },
    });
  }

  if (createRequest.isSuccess) {
    return (
      <div role="status" className="flex flex-col gap-2 rounded-xl bg-card p-6">
        <h3 ref={(heading) => heading?.focus()} tabIndex={-1} className="font-serif text-3xl outline-none">
          {t('projectRequest.successTitle')}
        </h3>
        <p>{t('projectRequest.successText', { name: artist.firstName })}</p>
      </div>
    );
  }

  const hasServerError = createRequest.isError && !getProblem(createRequest.error)?.errors;

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">{t('projectRequest.requiredHint')}</p>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 font-serif text-2xl">{t('projectRequest.identity')}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="firstName"
            label={t('projectRequest.firstName')}
            autoComplete="given-name"
            value={values.firstName}
            onChange={(value) => setText('firstName', value)}
            error={errorText('firstName')}
          />
          <TextField
            id="lastName"
            label={t('projectRequest.lastName')}
            autoComplete="family-name"
            value={values.lastName}
            onChange={(value) => setText('lastName', value)}
            error={errorText('lastName')}
          />
        </div>
        <TextField
          id="email"
          type="email"
          label={t('projectRequest.email')}
          autoComplete="email"
          value={values.email}
          onChange={(value) => setText('email', value)}
          error={errorText('email')}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 font-serif text-2xl">{t('projectRequest.project')}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="bodyArea"
            label={t('projectRequest.bodyArea')}
            hint={t('projectRequest.bodyAreaHint')}
            value={values.bodyArea}
            onChange={(value) => setText('bodyArea', value)}
            error={errorText('bodyArea')}
          />
          <TextField
            id="size"
            label={t('projectRequest.size')}
            hint={t('projectRequest.sizeHint')}
            value={values.size}
            onChange={(value) => setText('size', value)}
            error={errorText('size')}
          />
        </div>

        <fieldset aria-describedby={errors.tagIds ? 'tagIds-error' : undefined}>
          <legend className="mb-2 text-sm font-medium">{t('projectRequest.styles')}</legend>
          <ul className="flex flex-wrap gap-2">
            {artist.styles.map((style) => (
              <li key={style.id}>
                <Label className="rounded-full border px-3 py-2 font-normal has-data-checked:border-primary">
                  <Checkbox
                    checked={values.tagIds.includes(style.id)}
                    onCheckedChange={() => setValues({ ...values, tagIds: toggle(values.tagIds, style.id) })}
                    aria-invalid={Boolean(errors.tagIds)}
                  />
                  {style.name}
                </Label>
              </li>
            ))}
          </ul>
          {errors.tagIds && (
            <p id="tagIds-error" className="mt-2 text-sm text-destructive">
              {errorText('tagIds')}
            </p>
          )}
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('projectRequest.budget')}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="budgetMin"
              inputMode="numeric"
              label={t('projectRequest.budgetMin')}
              value={values.budgetMin}
              onChange={(value) => setText('budgetMin', value)}
              error={errorText('budgetMin')}
            />
            <TextField
              id="budgetMax"
              inputMode="numeric"
              label={t('projectRequest.budgetMax')}
              value={values.budgetMax}
              onChange={(value) => setText('budgetMax', value)}
              error={errorText('budgetMax')}
            />
          </div>
        </fieldset>

        <TextField
          id="description"
          multiline
          label={t('projectRequest.description')}
          hint={t('projectRequest.descriptionHint')}
          value={values.description}
          onChange={(value) => setText('description', value)}
          error={errorText('description')}
        />
      </fieldset>

      <fieldset
        className="flex flex-col gap-4"
        aria-describedby={errors.availability ? 'availability-hint availability-error' : 'availability-hint'}
      >
        <legend className="mb-2 font-serif text-2xl">{t('projectRequest.availability')}</legend>
        <p id="availability-hint" className="text-sm text-muted-foreground">
          {t('projectRequest.availabilityHint')}
        </p>
        <AvailabilityGrid
          workingSlots={artist.workingSlots}
          value={values.availability}
          onToggle={(slot) => setValues({ ...values, availability: toggle(values.availability, slot) })}
          invalid={Boolean(errors.availability)}
        />
        <Label className="font-normal">
          <Checkbox
            checked={values.flexibleSchedule}
            onCheckedChange={(checked) => setValues({ ...values, flexibleSchedule: checked })}
          />
          {t('projectRequest.flexibleSchedule')}
        </Label>
        {errors.availability && (
          <p id="availability-error" className="text-sm text-destructive">
            {errorText('availability')}
          </p>
        )}
      </fieldset>

      {hasServerError && (
        <p role="alert" className="text-sm text-destructive">
          {t('common.genericError')}
        </p>
      )}

      <Button type="submit" size="lg" disabled={createRequest.isPending} className="self-start px-6">
        {createRequest.isPending ? t('projectRequest.sending') : t('projectRequest.submit')}
      </Button>
    </form>
  );
}
