import type { FieldErrors } from '@inkflow/shared';

export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly errors?: FieldErrors;

  constructor(status: number, code: string, errors?: FieldErrors) {
    super(code);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}
