import { STATUS_CODES } from 'node:http';
import type { ErrorRequestHandler, Response } from 'express';
import type { FieldErrors } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';

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
  // Malformed JSON body, raised by express.json()
  if (error instanceof SyntaxError && 'type' in error && error.type === 'entity.parse.failed') {
    sendProblem(res, 400, 'invalid_json');
    return;
  }
  // Never expose internal details to the client
  console.error(error);
  sendProblem(res, 500, 'internal_error');
};
