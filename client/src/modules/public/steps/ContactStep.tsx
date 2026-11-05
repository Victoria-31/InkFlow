import { useTranslation } from 'react-i18next';
import { TextField } from '@/components/ui/text-field';
import { Notice } from '../components/Notice';
import type { StepProps } from './types';

export function ContactStep({ artist, values, errorText, update }: StepProps) {
  const { t } = useTranslation();

  return (
    <>
      <TextField
        id="firstName"
        autoComplete="given-name"
        label={`${t('request.contact.firstName')} *`}
        value={values.firstName}
        onChange={(value) => update({ firstName: value })}
        error={errorText('firstName')}
      />
      <TextField
        id="lastName"
        autoComplete="family-name"
        label={`${t('request.contact.lastName')} *`}
        value={values.lastName}
        onChange={(value) => update({ lastName: value })}
        error={errorText('lastName')}
      />
      <TextField
        id="email"
        type="email"
        autoComplete="email"
        label={`${t('request.contact.email')} *`}
        value={values.email}
        onChange={(value) => update({ email: value })}
        error={errorText('email')}
      />
      <Notice title={t('request.contact.noticeTitle')}>{t('request.contact.noticeText', { name: artist.firstName })}</Notice>
    </>
  );
}
