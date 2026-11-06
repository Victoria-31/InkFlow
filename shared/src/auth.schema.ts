import { z } from 'zod';
import { requiredText } from './validation.js';

export const loginSchema = z
  .object({
    email: requiredText(255).toLowerCase().pipe(z.email('invalid_email')),
    password: z.string('required').min(1, 'required').max(255, 'too_long'),
  })

export type LoginInput = z.infer<typeof loginSchema>;
