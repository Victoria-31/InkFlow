import { useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { projectRequestSchema, validate, type FieldErrors } from '@inkflow/shared';
import { Button, buttonVariants } from '@/components/ui/button';
import { getProblem } from '@/request/http';
import { ArtistQueryState } from '../components/ArtistQueryState';
import { PublicPage } from '../components/PublicPage';
import { StepLayout } from '../components/StepLayout';
import { useArtist } from '../hooks/useArtist';
import { useCreateProjectRequest } from '../hooks/useCreateProjectRequest';
import {
  byField,
  clearErrors,
  emptyForm,
  errorsUpToStep,
  firstStepWithError,
  keepAvailableChoices,
  STEPS,
  toRequest,
  type FormValues,
} from '../project-request-form';
import { ContactStep } from '../steps/ContactStep';
import { ProjectStep } from '../steps/ProjectStep';
import { RequestSent } from '../steps/RequestSent';
import { ReviewStep } from '../steps/ReviewStep';

export function ProjectRequestPage() {
  const { username = '' } = useParams();
  const { t } = useTranslation();
  const query = useArtist(username);
  const createRequest = useCreateProjectRequest(username);
  const [stepIndex, setStepIndex] = useState(0);
  const [enteredValues, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});

  if (!query.data) return <ArtistQueryState query={query} />;

  const artist = query.data;
  const values = keepAvailableChoices(enteredValues, artist);
  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  function update(patch: Partial<FormValues>) {
    setValues({ ...values, ...patch });
    setErrors(clearErrors(errors, patch));
  }

  function goBack() {
    createRequest.reset();
    setStepIndex(isLastStep ? 0 : stepIndex - 1);
  }
  const errorText = (field: string) => (errors[field] ? t(`errors.${errors[field]}`) : undefined);

  function showErrors(fieldErrors: FieldErrors) {
    // Go back to the first step with an error, render it, then focus the first invalid field
    const target = firstStepWithError(fieldErrors);
    flushSync(() => {
      setErrors(fieldErrors);
      if (target >= 0) setStepIndex(target);
    });
    document.querySelector<HTMLElement>('main [aria-invalid="true"]')?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // The whole schema is checked; only the fields of the steps reached so far must be valid
    const result = validate(projectRequestSchema, toRequest(values));
    const blocking = result.success ? {} : errorsUpToStep(byField(result.errors), stepIndex);

    if (Object.keys(blocking).length > 0) {
      showErrors(blocking);
      return;
    }
    setErrors({});
    if (!isLastStep) {
      setStepIndex(stepIndex + 1);
      return;
    }
    if (result.success) {
      createRequest.mutate(result.data, {
        onError: (error) => {
          const fieldErrors = getProblem(error)?.errors;
          if (fieldErrors) showErrors(byField(fieldErrors));
        },
      });
    }
  }

  if (createRequest.isSuccess) {
    return (
      <PublicPage artist={artist}>
        <RequestSent artist={artist} values={values} project={createRequest.data} />
      </PublicPage>
    );
  }

  const stepProps = { artist, values, errors, errorText, update };
  let submitLabel = t('common.continue');
  if (isLastStep) submitLabel = createRequest.isPending ? t('request.review.sending') : t('request.review.submit');
  const hasServerError = createRequest.isError && !getProblem(createRequest.error)?.errors;

  return (
    <PublicPage artist={artist}>
      <StepLayout
        key={step}
        artist={artist}
        stepIndex={stepIndex}
        title={t(`request.${step}.title`)}
        intro={step === 'contact' ? undefined : t(`request.${step}.intro`, { name: artist.firstName })}
        aside={
          step === 'contact' && (
            <div className="mt-4 hidden flex-col gap-1 lg:flex">
              <p className="text-body font-medium">{t('request.contact.asideTitle')}</p>
              <p className="text-body text-muted-foreground">{t('request.contact.asideText')}</p>
            </div>
          )
        }
      >
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
          {step === 'project' && <ProjectStep {...stepProps} />}
          {step === 'contact' && <ContactStep {...stepProps} />}
          {step === 'review' && <ReviewStep {...stepProps} />}

          {step !== 'review' && <p className="text-small text-muted-foreground">{t('request.requiredNote')}</p>}
          {hasServerError && (
            <p role="alert" className="text-body text-destructive">
              {t('common.genericError')}
            </p>
          )}

          <div className="flex gap-3">
            {stepIndex === 0 ? (
              <Link to={`/${artist.username}`} className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
                {t('common.back')}
              </Link>
            ) : (
              <Button type="button" variant="secondary" size="lg" disabled={createRequest.isPending} onClick={goBack}>
                {isLastStep ? t('request.review.edit') : t('common.back')}
              </Button>
            )}
            <Button type="submit" size="lg" className="flex-1" disabled={createRequest.isPending}>
              {submitLabel}
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </form>
      </StepLayout>
    </PublicPage>
  );
}
