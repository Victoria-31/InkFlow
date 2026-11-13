import { z } from 'zod';

// PostgreSQL INT upper bound
const MAX_ID = 2_147_483_647;

// Digits only: Number() would also accept "0x10" or "1e3"
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, 'invalid_id')
    .refine((id) => Number(id) <= MAX_ID, 'invalid_id'),
});
