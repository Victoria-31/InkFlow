import type { RequestHandler } from 'express';
import { HttpError } from '../errors/http-error.js';

// No API route matched: answer with a Problem Details 404 instead of Express's HTML page
export const notFound: RequestHandler = (_req, _res, next) => {
  next(new HttpError(404, 'route_not_found'));
};
