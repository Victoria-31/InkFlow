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

export type AuthAccount = { id: number; role: Role };

type AuthTokenPayload = { sub: string; role: Role };

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, APP_SECRET, {
    algorithm: 'HS256',
    expiresIn: SESSION_DURATION_MS / 1000,
  });
}

// Throws if the token is expired or its signature is invalid
export function verifyAuthToken(token: string): AuthAccount {
  const payload = jwt.verify(token, APP_SECRET, { algorithms: ['HS256'] }) as AuthTokenPayload;
  return { id: Number(payload.sub), role: payload.role };
}
