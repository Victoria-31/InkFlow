import { STATUS_CODES } from 'node:http';
import type { ErrorRequestHandler, Response } from 'express';
import type { FieldErrors } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';

const BODY_ERROR_CODES: Record<string, string> = {
  'entity.parse.failed': 'invalid_json',
  'entity.too.large': 'payload_too_large',
};

// Problem Details (RFC 9457); "code" and "errors" are extension members translated by the client
function sendProblem(res: Response, status: number, code: string, errors?: FieldErrors) {
  const problem = { type: 'about:blank', title: STATUS_CODES[status], status, code, errors };
  res.status(status).type('application/problem+json').json(problem);
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    sendProblem(res, error.status, error.code, error.errors);
    return;
  }
  // Raised by express.json() (malformed JSON 400, body too large 413, unsupported encoding 415):
  // these errors carry their own 4xx status and are flagged as safe to show (expose)
  if (error?.expose && error.status >= 400 && error.status < 500) {
    sendProblem(res, error.status, BODY_ERROR_CODES[error.type] ?? 'invalid_body');
    return;
  }
  // Never expose internal details to the client
  console.error(error);
  sendProblem(res, 500, 'internal_error');
};
