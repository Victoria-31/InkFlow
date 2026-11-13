import { z } from 'zod';

// Field path ("budgetMax", "tagIds.0") → error code, translated by the client
export type FieldErrors = Record<string, string>;

export type ValidationResult<T> = { success: true; data: T } | { success: false; errors: FieldErrors };

export function validate<S extends z.ZodType>(schema: S, input: unknown): ValidationResult<z.output<S>> {
  const result = schema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path.join('.') || '_form';
    errors[field] ??= issue.message;
  }
  return { success: false, errors };
}

// Error messages are codes, translated by the client (i18n)
export const requiredText = (max: number) => z.string('required').trim().min(1, 'required').max(max, 'too_long');
