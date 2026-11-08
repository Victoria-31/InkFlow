import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as authService from '../services/auth.service.js';

export async function login(req: Request, res: Response) {
  const account = await authService.verifyCredentials(req.body);

  if (!process.env.APP_SECRET) {
    throw new Error('APP_SECRET is not set in .env');
  }

  const token = jwt.sign({ sub: account.id, role: account.role }, process.env.APP_SECRET, {
    expiresIn: '1y',
  });

  res.cookie('auth', token).json({ role: account.role });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('auth').sendStatus(204);
}
