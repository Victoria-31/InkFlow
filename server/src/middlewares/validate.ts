import type { RequestHandler } from 'express';
import { validate } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';

type Schema = Parameters<typeof validate>[0];

// Replaces req.body with the parsed data (trimmed strings, defaults applied)
export function validateBody(schema: Schema): RequestHandler {
  return (req, _res, next) => {
    const result = validate(schema, req.body);
    if (!result.success) {
      next(new HttpError(400, 'validation_error', result.errors));
      return;
    }
    req.body = result.data;
    next();
  };
}

// Checks only: params stay strings
export function validateParams(schema: Schema): RequestHandler {
  return (req, _res, next) => {
    const result = validate(schema, req.params);
    if (!result.success) {
      next(new HttpError(400, 'validation_error', result.errors));
      return;
    }
    next();
  };
}

// Checks only: Express 5 does not let req.query be replaced
export function validateQuery(schema: Schema): RequestHandler {
  return (req, _res, next) => {
    const result = validate(schema, req.query);
    if (!result.success) {
      next(new HttpError(400, 'validation_error', result.errors));
      return;
    }
    next();
  };
}
