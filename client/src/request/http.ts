import axios from 'axios';
import type { FieldErrors } from '@inkflow/shared';

// The Vite dev server proxies /api to the Express API
export const http = axios.create({ baseURL: '/api' });

// Error body sent by the API (Problem Details, RFC 9457)
export type Problem = { type: string; title: string; status: number; code: string; errors?: FieldErrors };

export function getProblem(error: Error): Problem | undefined {
  if (axios.isAxiosError<Problem>(error)) {
    return error.response?.data;
  }
  return undefined;
}
