import type { FieldErrors, PublicArtist } from '@inkflow/shared';
import type { FormValues } from '../project-request-form';

export type StepProps = {
  artist: PublicArtist;
  values: FormValues;
  errors: FieldErrors;
  errorText: (field: string) => string | undefined;
  update: (patch: Partial<FormValues>) => void;
};
