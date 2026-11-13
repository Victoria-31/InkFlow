import type { RequestHandler } from 'express';
import type { Role } from '@prisma/client';
import { HttpError } from '../errors/http-error.js';
import { AUTH_COOKIE, verifyAuthToken } from '../utils/session.js';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) {
    throw new HttpError(401, 'unauthenticated');
  }

  try {
    req.account = verifyAuthToken(token);
  } catch {
    throw new HttpError(401, 'unauthenticated');
  }
  next();
};

// Must come after requireAuth
export function requireRole(role: Role): RequestHandler {
  return (req, _res, next) => {
    if (req.account?.role !== role) {
      throw new HttpError(403, 'forbidden');
    }
    next();
  };
}
