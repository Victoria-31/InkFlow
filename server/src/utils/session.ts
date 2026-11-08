import type { CookieOptions } from 'express';
import type { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

if (!process.env.APP_SECRET) {
  throw new Error('APP_SECRET is not set in .env');
}
const APP_SECRET = process.env.APP_SECRET;

export const AUTH_COOKIE = 'auth';
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export function signAuthToken(payload: { sub: string; role: Role }) {
  return jwt.sign(payload, APP_SECRET, {
    algorithm: 'HS256',
    expiresIn: SESSION_DURATION_MS / 1000,
  });
}
