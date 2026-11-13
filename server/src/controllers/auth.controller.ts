import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { AUTH_COOKIE, SESSION_DURATION_MS, authCookieOptions } from '../utils/session.js';

export async function login(req: Request, res: Response) {
  const { token, role } = await authService.login(req.body);

  res.cookie(AUTH_COOKIE, token, { ...authCookieOptions, maxAge: SESSION_DURATION_MS }).json({ role });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(AUTH_COOKIE, authCookieOptions).sendStatus(204);
}

export function me(req: Request, res: Response) {
  res.json(req.account);
}
