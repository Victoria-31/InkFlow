import { useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { loginSchema, validate, type FieldErrors, type LoginInput } from '@inkflow/shared';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { HOME_PATHS } from '@/components/home-paths';
import { useNewScreen } from '@/hooks/useNewScreen';
import { getProblem } from '@/request/http';
import { useLogin } from '../hooks/useLogin';

const emptyCredentials: LoginInput = { email: '', password: '' };

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const headingRef = useNewScreen<HTMLHeadingElement>();
  const loginMutation = useLogin();
  const [values, setValues] = useState(emptyCredentials);
  const [errors, setErrors] = useState<FieldErrors>({});

  function update(field: keyof LoginInput, value: string) {
    setValues({ ...values, [field]: value });
    setErrors(Object.fromEntries(Object.entries(errors).filter(([key]) => key !== field)));
    loginMutation.reset();
  }

  const errorText = (field: keyof LoginInput) => (errors[field] ? t(`errors.${errors[field]}`) : undefined);

  function showErrors(fieldErrors: FieldErrors) {
    flushSync(() => setErrors(fieldErrors));
    document.querySelector<HTMLElement>('main [aria-invalid="true"]')?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validate(loginSchema, values);
    if (!result.success) {
      showErrors(result.errors);
      return;
    }
    setErrors({});
    loginMutation.mutate(result.data, {
      onSuccess: ({ role }) => navigate(HOME_PATHS[role], { replace: true }),
      onError: (error) => {
        const fieldErrors = getProblem(error)?.errors;
        if (fieldErrors) showErrors(fieldErrors);
      },
    });
  }

  // Same message for an unknown email and a wrong password: the page must not reveal which accounts exist
  let formError: string | undefined;
  if (loginMutation.isError) {
    const problem = getProblem(loginMutation.error);
    if (problem?.status === 401) formError = t('errors.invalid_credentials');
    else if (!problem?.errors) formError = t('common.genericError');
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-6 px-4 py-16">
      <h1 ref={headingRef} tabIndex={-1} className="page-title outline-none">
        {t('login.title')}
      </h1>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
        <TextField
          id="email"
          type="email"
          autoComplete="email"
          label={t('login.email')}
          value={values.email}
          onChange={(value) => update('email', value)}
          error={errorText('email')}
        />
        <TextField
          id="password"
          type="password"
          autoComplete="current-password"
          label={t('login.password')}
          value={values.password}
          onChange={(value) => update('password', value)}
          error={errorText('password')}
        />
        <p className="text-small text-muted-foreground">{t('login.requiredNote')}</p>
        {formError && (
          <p role="alert" className="text-body text-destructive">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? t('login.submitting') : t('login.submit')}
        </Button>
      </form>
    </main>
  );
}
