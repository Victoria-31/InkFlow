import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../app.js';
import { prisma } from '../db/prisma.js';
import { hashPassword } from '../utils/password.js';

// Runs against a real PostgreSQL database (Docker locally, service container in CI)
const email = `test-auth-${Date.now()}@example.com`;
const password = 'correct-password';
let accountId: number;

const cookieHeader = (res: request.Response) => [res.headers['set-cookie']].flat().join(';');

beforeAll(async () => {
  const account = await prisma.account.create({
    data: { firstName: 'Ren', lastName: 'Test', email, passwordHash: await hashPassword(password), role: 'ARTIST' },
  });
  accountId = account.id;
});

afterAll(async () => {
  await prisma.account.delete({ where: { id: accountId } });
  await prisma.$disconnect();
});

describe('POST /api/auth/login', () => {
  it('sets an httpOnly session cookie and returns the role', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ role: 'ARTIST' });
    expect(cookieHeader(res)).toMatch(/auth=.+/);
    expect(cookieHeader(res)).toContain('HttpOnly');
    expect(cookieHeader(res)).toContain('SameSite=Lax');
  });

  it('returns 401 for a wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'invalid_credentials' });
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it('returns the same 401 for an unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'invalid_credentials' });
  });

  it('returns 400 for an invalid body', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email', password: '' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('returns 401 without a session cookie', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'unauthenticated' });
  });

  it('returns 401 for a tampered token', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', 'auth=not.a.valid-token');

    expect(res.status).toBe(401);
  });

  it('returns the logged-in account', async () => {
    // An agent keeps cookies between requests, like a browser
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email, password });

    const res = await agent.get('/api/auth/me');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: accountId, role: 'ARTIST' });
  });
});

describe('POST /api/auth/logout', () => {
  it('clears the session cookie', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email, password });

    const res = await agent.post('/api/auth/logout');

    expect(res.status).toBe(204);
    expect((await agent.get('/api/auth/me')).status).toBe(401);
  });
});
