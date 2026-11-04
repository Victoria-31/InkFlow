import { z } from 'zod';
import { AVAILABILITIES } from './availability.js';

// Error messages are codes, translated by the client (i18n)
const requiredText = (max: number) => z.string('required').trim().min(1, 'required').max(max, 'too_long');

function hasIssueOn(payload: z.core.ParsePayload, fields: string[]) {
  return payload.issues.some((issue) => fields.includes(String(issue.path?.[0])));
}

// Budget is stored as DECIMAL(8, 2)
const budget = z.number('invalid_budget').int('invalid_budget').positive('invalid_budget').max(999_999, 'invalid_budget');

export const projectRequestSchema = z
  .object({
    firstName: requiredText(100),
    lastName: requiredText(100),
    email: requiredText(255).pipe(z.email('invalid_email')),
    bodyArea: requiredText(100),
    size: requiredText(50),
    tagIds: z.array(z.number().int().positive()).default([]),
    budgetMin: budget.optional(),
    budgetMax: budget.optional(),
    description: requiredText(2000),
    availability: z.array(z.enum(AVAILABILITIES, 'invalid_availability')).default([]),
    flexibleSchedule: z.boolean().default(false),
    // GDPR: the prospect agrees that the artist uses these details to study the request
    consent: z.literal(true, 'consent_required'),
  })
  // Cross-field rules run as soon as the fields they use are valid,
  // so every error comes back in the same response
  .refine((r) => r.budgetMin === undefined || r.budgetMax === undefined || r.budgetMin <= r.budgetMax, {
    path: ['budgetMax'],
    error: 'budget_order',
    when: (payload) => !hasIssueOn(payload, ['budgetMin', 'budgetMax']),
  })
  .refine((r) => r.flexibleSchedule || r.availability.length > 0, {
    path: ['availability'],
    error: 'availability_required',
    when: (payload) => !hasIssueOn(payload, ['availability', 'flexibleSchedule']),
  });

// What the form sends (defaults not applied yet) and what the API receives after validation
export type ProjectRequestInput = z.input<typeof projectRequestSchema>;
export type ProjectRequest = z.output<typeof projectRequestSchema>;
