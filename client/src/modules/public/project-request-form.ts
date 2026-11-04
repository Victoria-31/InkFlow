import type { Availability, FieldErrors, ProjectRequestInput } from '@inkflow/shared';

// Form values as typed by the user: budgets stay strings until submission
export type FormValues = Omit<ProjectRequestInput, 'budgetMin' | 'budgetMax' | 'consent'> & {
  budgetMin: string;
  budgetMax: string;
  tagIds: number[];
  availability: Availability[];
  flexibleSchedule: boolean;
  consent: boolean;
};

export const emptyForm: FormValues = {
  bodyArea: '',
  size: '',
  tagIds: [],
  budgetMin: '',
  budgetMax: '',
  description: '',
  availability: [],
  flexibleSchedule: false,
  firstName: '',
  lastName: '',
  email: '',
  consent: false,
};

export const STEPS = ['project', 'contact', 'review'] as const;
export type Step = (typeof STEPS)[number];

// Fields validated before leaving each step
export const STEP_FIELDS: Record<Step, string[]> = {
  project: ['bodyArea', 'size', 'tagIds', 'budgetMin', 'budgetMax', 'description', 'availability', 'flexibleSchedule'],
  contact: ['firstName', 'lastName', 'email'],
  review: ['consent'],
};

// An empty budget field means "no budget"
function toAmount(value: string) {
  return value.trim() === '' ? undefined : Number(value);
}

export function toRequest(values: FormValues) {
  return { ...values, budgetMin: toAmount(values.budgetMin), budgetMax: toAmount(values.budgetMax) };
}

export function toggle<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

// "availability.0" → "availability": one error per field, keeping the first
export function byField(errors: FieldErrors) {
  const result: FieldErrors = {};
  for (const [path, code] of Object.entries(errors)) {
    result[path.split('.')[0]] ??= code;
  }
  return result;
}

// Errors of the steps reached so far: later steps are not filled in yet
export function errorsUpToStep(errors: FieldErrors, stepIndex: number) {
  const fields = STEPS.slice(0, stepIndex + 1).flatMap((step) => STEP_FIELDS[step]);
  return Object.fromEntries(Object.entries(errors).filter(([field]) => fields.includes(field)));
}

// An edited field loses its error; the schedule checkbox also answers the availability error
export function clearErrors(errors: FieldErrors, patch: Partial<FormValues>) {
  const edited = Object.keys(patch);
  if (edited.includes('flexibleSchedule')) edited.push('availability');
  return Object.fromEntries(Object.entries(errors).filter(([field]) => !edited.includes(field)));
}

export function firstStepWithError(errors: FieldErrors) {
  return STEPS.findIndex((step) => STEP_FIELDS[step].some((field) => field in errors));
}
