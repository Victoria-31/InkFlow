import cookieParser from 'cookie-parser';
import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { errorHandler } from './error-handler.js';
import { requireAuth, requireRole } from './auth.js';
import { AUTH_COOKIE, signAuthToken } from '../utils/session.js';

// Throwaway app: no route uses requireRole yet
const app = express();
app.use(cookieParser());
app.get('/artist-only', requireAuth, requireRole('ARTIST'), (_req, res) => {
  res.sendStatus(204);
});
app.use(errorHandler);

const cookieFor = (role: 'ARTIST' | 'CLIENT') => `${AUTH_COOKIE}=${signAuthToken({ sub: '1', role })}`;

describe('requireRole', () => {
  it('lets the expected role through', async () => {
    const res = await request(app).get('/artist-only').set('Cookie', cookieFor('ARTIST'));

    expect(res.status).toBe(204);
  });

  it('returns 403 for another role', async () => {
    const res = await request(app).get('/artist-only').set('Cookie', cookieFor('CLIENT'));

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ code: 'forbidden' });
  });
});
